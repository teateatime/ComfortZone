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

  const handleJobClick = (job: any) => {
    // Save the entire job object to localStorage
    localStorage.setItem('selectedJob', JSON.stringify(job));
    navigate(`/job-description`);
  };  

  return (
    <>
      <Navbar variant="jobsearch" />
      <Box
        sx={{
          pt: 10,
          px: 3,
          pb: 6,
          mx: 'auto',
          maxWidth: '1200px',
          bgcolor: '#f4f6f8',
          minHeight: '100vh',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          List of Jobs
        </Typography>

        <TextField
          label="Search for jobs"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ mb: 4 }}
        />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" align="center" sx={{ my: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <Grid container spacing={4}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card
                  elevation={4}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mb: 1,
                      }}
                    >
                      {job.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {job.company.display_name} – {job.location.display_name}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      justifyContent: 'space-between',
                      px: 2,
                      py: 1,
                      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    <Button
                      size="small"
                      href={job.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Adzuna
                    </Button>

                    <Button size="small" onClick={() => handleJobClick(job)}>
                      Details
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