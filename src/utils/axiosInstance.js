import axios from 'axios';
import { message } from 'antd';

const API_URL = 'https://localhost:7284/api';
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to include Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshResponse = await axios.post(`${API_URL}/SysUsers/RefreshToken`, {
          RefreshToken: refreshToken,
        });

        if (refreshResponse.data.status === 1) {
          const { Data: newAccessToken, RefreshToken: newRefreshToken } = refreshResponse.data;
          // Save new tokens
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          // Clear tokens and redirect to login if refresh token fails
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          message.error('Session expired. Please log in again.');
          window.location.href = '/';
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login on error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        message.error('An error occurred while refreshing the token. Please log in again.');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;