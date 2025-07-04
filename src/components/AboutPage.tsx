import { Container, Typography, Box, Divider } from '@mui/material';
import Navbar from './Navbar';
import '../css/AboutPage.css';

function AboutPage() {
  return (
    <>
      <Navbar variant="jobsearch" />
      <Box
        className="about_background"
        sx={{
          pt: 10,
          minHeight: '100vh',
          minWidth: '100vw',
          bgcolor: '#f4f6f8',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            About ComfortZone
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body1" paragraph>
            <strong>ComfortZone</strong> is a modern web application designed to simplify your search for both job opportunities and nearby temporary housing options — all within a single, centralized platform. Whether you're relocating for a new role or exploring your next career move, ComfortZone equips you with the tools to make informed decisions about where to live and work.
          </Typography>

          <Typography variant="body1" paragraph>
            Our platform integrates job listings with nearby short-term stays such as inns and apartments, providing a convenient way to scout out neighborhoods and housing options before making a long-term commitment. This helps reduce the hassle of juggling multiple websites and offers personalized recommendations tailored to your needs.
          </Typography>

          <Typography variant="body1" paragraph>
            Built with <strong>React</strong> and powered by a <strong>.NET</strong> backend, ComfortZone leverages modern web technologies to deliver speed, reliability, and security.
          </Typography>

          <Typography variant="body1" paragraph>
            We're passionate about helping users find their next opportunity — and a comfortable place to start — all in one place.
          </Typography>
        </Container>
      </Box>
    </>
  );
}

export default AboutPage;