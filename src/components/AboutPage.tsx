import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import Navbar from './Navbar';
import '../css/AboutPage.css';

function AboutPage() {
  return (
    <>
      <Container sx={{ pt: 8}}>
      <Navbar variant="jobsearch" />
      <Box className="about_background" py={5}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            About ComfortZone
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body1" paragraph>
            ComfortZone is a modern web application built to simplify the process of searching for both job opportunities and housing options in one centralized platform. 
            Whether you're relocating for a new role or planning your next career move, ComfortZone empowers you with the tools you need to make informed life decisions.
          </Typography>

          <Typography variant="body1" paragraph>
            Our platform integrates job boards and real estate listings, curates personalized recommendations, and offers a clean, user-friendly experience to reduce the stress of searching on multiple platforms.
          </Typography>

          <Typography variant="body1" paragraph>
            Built with React and powered by a .NET backend, ComfortZone leverages modern web technologies to deliver speed, reliability, and security.
          </Typography>

          <Typography variant="body1" paragraph>
            We’re passionate about helping users find their next home *and* their next opportunity — all in one place.
          </Typography>
        </Container>
      </Box>
      </Container>
    </>
  );
}

export default AboutPage;