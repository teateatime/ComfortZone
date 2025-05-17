import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function DescriptionPage() {
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedJob = localStorage.getItem('selectedJob');
    if (selectedJob) {
      const job = JSON.parse(selectedJob);
      setJobDetails(job);
      setLoading(false);
    } else {
      setError('No job details found');
      setLoading(false);
    }
  }, []);

  const handleBackToList = () => {
    navigate(-1);
  };

  const formatSalary = (min: number | undefined, max: number | undefined) => {
    if (min && max) {
      return `$${min.toLocaleString('en-US')} - $${max.toLocaleString('en-US')}`;
    } else if (min) {
      return `From $${min.toLocaleString('en-US')}`;
    } else if (max) {
      return `Up to $${max.toLocaleString('en-US')}`;
    }
    return 'Not Disclosed';
  };

  return (
    <Box sx={{ padding: '2rem', margin: '0 auto', maxWidth: '1200px', background: 'mintcream' }}>
      {loading && <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />}
      {error && <Typography color="error">{error}</Typography>}
      {jobDetails && (
        <Box>
          {/* Header Section */}
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {jobDetails.title}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {jobDetails.company.display_name}
          </Typography>

          {/* Job Details Section */}
          <Grid container spacing={2} sx={{ marginTop: '1.5rem' }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Location:</strong> {jobDetails.location?.display_name || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Salary:</strong>{' '}
                {formatSalary(jobDetails.salary_min, jobDetails.salary_max)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Job Type:</strong> {jobDetails.contract_time || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Category:</strong> {jobDetails.category?.label || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider sx={{ marginY: '2rem' }} />

          {/* Job Description Section */}
          <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
            Job Description
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: 1.6,
            }}
          >
            {jobDetails.description || 'No description available.'}
          </Typography>

          {/* Back Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: '2rem' }}
            onClick={handleBackToList}
          >
            Back to Job List
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default DescriptionPage;