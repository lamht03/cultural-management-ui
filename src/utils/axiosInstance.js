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
    // Nếu lỗi 401 (Unauthorized) và yêu cầu chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
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

          // Thử lại yêu cầu gốc với accessToken mới
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          // Nếu refresh token không hợp lệ
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        message.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/'; // Redirect đến trang đăng nhập
      }
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
