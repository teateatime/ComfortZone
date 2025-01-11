import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/index.css';
import LandingPage from './components/LandingPage.tsx';
import HomePage from './components/HomePage.tsx';
import SearchPage from './components/SearchPage.tsx';
import JobViewPage from './components/JobViewPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        {/* Home Page */}
        <Route path="/home" element={<HomePage />} />
        {/* Search Page */}
        <Route path="/search" element={<SearchPage />} />
        {/* Job View Page */}
        <Route path="/jobview" element={<JobViewPage />} />
      </Routes>
    </Router>
  </StrictMode>,
);
