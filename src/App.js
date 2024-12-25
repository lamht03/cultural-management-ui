import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

// Helper functions to check authentication status
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken'); // Check if accessToken exists
};

// PrivateRoute for protected routes
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

// PublicRoute for login, preventing access when logged in
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          {/* Public Route: Login */}
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          
          {/* Private Route: Dashboard */}
          <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
