import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
} from '@mui/material';
import axios from 'axios';

function HomePage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const APP_ID = 'eb5d5bed';
  const APP_KEY = '5e413592809866c590cb33e535588b40';
  const COUNTRY = 'us';
  const URL = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=30`;

  const CACHE_KEY = 'jobsCache';
  const CACHE_EXPIRATION_KEY = 'jobsCacheExpiration';
  const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

  useEffect(() => {
    const fetchJobs = async () => {
      const cachedJobs = localStorage.getItem(CACHE_KEY);
      const cacheExpiration = localStorage.getItem(CACHE_EXPIRATION_KEY);

      // Check if cache exists and is not expired
      if (cachedJobs && cacheExpiration && Date.now() < parseInt(cacheExpiration)) {
        setJobs(JSON.parse(cachedJobs));
        setLoading(false);
      } else {
        try {
          const response = await axios.get(URL);
          const results = response.data.results || [];

          // Save the results to localStorage
          localStorage.setItem(CACHE_KEY, JSON.stringify(results));
          localStorage.setItem(CACHE_EXPIRATION_KEY, (Date.now() + CACHE_EXPIRATION_TIME).toString());

          setJobs(results);
        } catch (error) {
          setError('Failed to fetch jobs. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobs();
  }, []);

  const handleSearchSubmit = () => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <>
      <Navbar variant="jobsearch" />
      <Box sx={{ padding: '2rem', margin: '0 auto', maxWidth: '1200px', background: 'mintcream' }}>
        <Typography variant="h4" sx={{ marginTop: '4rem', textAlign: 'center' }}>
          List of Jobs
        </Typography>

        <TextField
          label="Search for jobs"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ marginTop: '1rem', marginBottom: '1rem' }}
        />

        {loading && <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && (
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {job.company.display_name} - {job.location.display_name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" href={job.redirect_url} target="_blank" rel="noopener noreferrer">
                      View Job
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

export default HomePage;