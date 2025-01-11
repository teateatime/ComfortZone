import Navbar from './Navbar';
import Typography from '@mui/material/Typography';
import '../css/LandingPage.css';

function LandingPage() {
  return (
    <>
      {/* Main Landing Page Content */}
      <div className="landing_background">
        {/* Navbar */}
        <Navbar />
        <Typography variant="h3" component="h3" align="center" color="primary" gutterBottom>
          Welcome to ComfortZone
        </Typography>
        <Typography variant="h6" component="p" align="center" color='black'>
          A web application designed to help users find jobs and housing in a more streamlined fashion.
        </Typography>
      </div>
    </>
  );
}

export default LandingPage;