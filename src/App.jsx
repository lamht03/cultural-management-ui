import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';
import axiosInstance from './utils/axiosInstance'; // Import axios của bạn

const refreshTokenOnReload = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    try {
      const response = await axiosInstance.post('/v1/HeThongNguoiDung/LamMoiToken', { RefreshToken: refreshToken });
      if (response.data.Status === 1) {
        console.log('✅ Token refreshed on page reload');
        localStorage.setItem('token', response.data.Data);
        localStorage.setItem('refreshToken', response.data.RefreshToken);
      } else {
        console.error('⚠️ Refresh token failed on reload');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('🚨 API refresh token error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }
};
refreshTokenOnReload(); // Gọi khi trang load

// Helper functions to check authentication status
const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Check if accessToken exists
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
