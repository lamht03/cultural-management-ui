import axios from 'axios';
import { message } from 'antd';
const API_URL = 'http://192.168.100.117:2003/api';
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Biến lưu trữ trạng thái refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Hàm thêm callback khi refresh token thành công
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Gọi lại tất cả yêu cầu khi refresh token thành công
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

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

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          // Gọi API refresh token
          const refreshResponse = await axios.post(`${API_URL}/SysUsers/RefreshToken`, {
            RefreshToken: refreshToken,
          });

          if (refreshResponse.data.Status === 1) {
            const { Data: newAccessToken, RefreshToken: newRefreshToken } = refreshResponse.data;
            // Lưu lại token mới vào localStorage
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            isRefreshing = false;
            onRefreshed(newAccessToken);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          isRefreshing = false;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          message.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!');
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }

      // Đợi token mới và thử lại yêu cầu gốc
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

// Hàm lưu token vào localStorage khi đăng nhập thành công
export const handleLoginSuccess = (newAccessToken, newRefreshToken) => {
  if (newAccessToken && newRefreshToken) {
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  } else {
    console.error('Invalid tokens provided.');
  }
};

export default axiosInstance;
