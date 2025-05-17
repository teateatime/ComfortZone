import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Typography from '@mui/material/Typography';
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
      <Typography variant="h3" align="center" color="primary" gutterBottom>
        Welcome to ComfortZone
      </Typography>
      <Typography variant="h6" align="center" color="black">
        A web application designed to help users find jobs and housing in a more streamlined fashion.
      </Typography>
      {highlight && (
        <Typography variant="subtitle1" align="center" color="black" sx={{ mt: 2 }}>
          {highlight}
        </Typography>
      )}
    </div>
  );
}

export default LandingPage;