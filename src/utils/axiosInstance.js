import axios from 'axios';
import { message } from 'antd';
const API_URL = 'https://localhost:7024/api';
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
let isRefreshing = false;
let refreshSubscribers = [];
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          isRefreshing = false;
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          message.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!');
          window.location.href = '/';
          return Promise.reject(new Error('No refresh token available'));
        }
        try {
          const refreshResponse = await axios.post(`${API_URL}/v1/HeThongNguoiDung/LamMoiToken`, { RefreshToken: refreshToken });
          if (refreshResponse.data.status === 1) {
            const { token: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            onRefreshed(newAccessToken);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          message.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!');
          window.location.href = '/';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return new Promise((resolve) => {
        subscribeTokenRefresh((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);
export const handleLoginSuccess = (newAccessToken, newRefreshToken) => {
  if (newAccessToken && newRefreshToken) {
    localStorage.setItem('token', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  } else {
    console.error('Invalid tokens provided.');
  }
};
export default axiosInstance;