import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Pagination,
  IconButton,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Filters
  const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]);
  const [salaryFilter, setSalaryFilter] = useState<string>('');
  const [country, setCountry] = useState<string>('us');

  const APP_ID = 'eb5d5bed';
  const APP_KEY = '5e413592809866c590cb33e535588b40';
  const RESULTS_PER_PAGE = 30;

  const queryParams = new URLSearchParams(location.search);
  const searchInput = queryParams.get('query') || '';

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      // Create cache key based on query and filters
      const cacheKey = `${searchInput}-${currentPage}-${jobTypeFilter.join(',')}-${salaryFilter}-${country}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setJobs(parsedData.results);
        setTotalJobs(parsedData.count);
        setLoading(false);
      } else {
        try {
          const filters = [];
          if (jobTypeFilter.includes('Full Time')) {
            filters.push(`full_time=1`);
          } else if (jobTypeFilter.includes('Part Time')) {
            filters.push(`part_time=1`);
          }
          if (salaryFilter) filters.push(`salary_min=${salaryFilter}`);

          const queryString = filters.length ? `&${filters.join('&')}` : '';
          const response = await axios.get(
            `https://api.adzuna.com/v1/api/jobs/${country}/search/${currentPage}?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=${RESULTS_PER_PAGE}&what=${encodeURIComponent(
              searchInput
            )}${queryString}&content-type=application/json`
          );

          const data = {
            results: response.data.results || [],
            count: response.data.count || 0,
          };
          setJobs(data.results);
          setTotalJobs(data.count);

          // Store in localStorage
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (error) {
          setError('Failed to fetch jobs. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    if (searchInput) fetchJobs();
  }, [searchInput, currentPage, jobTypeFilter, salaryFilter, country]);

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Navbar variant="jobsearch" />
      <Box sx={{ padding: '2rem', margin: '0 auto', maxWidth: '1200px' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', marginTop: '4rem', marginBottom: '1rem' }}>
          Search Results for {searchInput}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <TextField
            label="Search for jobs"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <IconButton onClick={() => setDrawerOpen(true)}>
            <FilterListIcon />
          </IconButton>
        </Box>

        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 300, padding: '1rem' }}>
            <Typography variant="h6">Filter Jobs</Typography>

            <FormControl fullWidth sx={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <InputLabel>Country</InputLabel>
              <Select value={country} onChange={(e) => setCountry(e.target.value)} label="Country">
                <MenuItem value="us">US</MenuItem>
                <MenuItem value="gb">UK</MenuItem>
              </Select>
            </FormControl>

            <FormGroup>
              <Typography variant="subtitle1">Job Type</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={jobTypeFilter.includes('Full Time')}
                    onChange={(e) =>
                      setJobTypeFilter(
                        e.target.checked
                          ? [...jobTypeFilter, 'Full Time']
                          : jobTypeFilter.filter((type) => type !== 'Full Time')
                      )
                    }
                  />
                }
                label="Full Time"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={jobTypeFilter.includes('Part Time')}
                    onChange={(e) =>
                      setJobTypeFilter(
                        e.target.checked
                          ? [...jobTypeFilter, 'Part Time']
                          : jobTypeFilter.filter((type) => type !== 'Part Time')
                      )
                    }
                  />
                }
                label="Part Time"
              />
            </FormGroup>

            <FormControl fullWidth sx={{ marginBottom: '1rem', marginTop: '1rem' }} variant="outlined">
              <InputLabel>Minimum Salary</InputLabel>
              <Select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                label="Minimum Salary"
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="50000">50,000</MenuItem>
                <MenuItem value="100000">100,000</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Drawer>

        {loading && <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && jobs.length === 0 && (
          <Typography sx={{ textAlign: 'center', marginTop: '2rem' }}>
            No results found for "{searchInput}".
          </Typography>
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <Grid container spacing={3}>
              {jobs.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job.id}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {job.company?.display_name} - {job.location?.display_name}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        href={job.redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Job
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <Pagination
                count={Math.ceil(totalJobs / RESULTS_PER_PAGE)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default SearchPage;