import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/index.css';
import LandingPage from './components/LandingPage.tsx';
import HomePage from './components/HomePage.tsx';
import SearchPage from './components/SearchPage.tsx';
import DescriptionPage from './components/DescriptionPage.tsx';
import SalaryPage from './components/SalaryPage.tsx';
import AboutPage from './components/AboutPage.tsx';

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
        {/* Job Description Page */}
        <Route path="/job-description" element={<DescriptionPage />} />
        {/* Salary History Page */}
        <Route path="/salary" element={<SalaryPage />} />
        {/* About Page */}
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
