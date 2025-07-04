import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../css/LandingPage.css';

function LandingPage() {
  const [highlight, setHighlight] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/landing/highlight')
      .then(res => res.json())
      .then(data => setHighlight(data.message))
      .catch(err => console.error("API fetch error:", err));
  }, []);

  return (
    <div className="landing_background">
      <Navbar variant="default" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: 3,
          pt: 10,
          maxWidth: 600,
          mx: 'auto',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to ComfortZone
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="white"
          sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)', mb: 2 }}
        >
          A web application designed to help users find jobs and nearby temporary housing options in a more streamlined fashion.
        </Typography>
        {highlight && (
          <Typography
            variant="subtitle1"
            align="center"
            color="white"
            sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)', mb: 16 }}
          >
            {highlight}
          </Typography>
        )}
      </Box>
    </div>
  );
}

export default LandingPage;