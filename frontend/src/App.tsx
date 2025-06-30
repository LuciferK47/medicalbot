import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <>
      {isAuthenticated && location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;