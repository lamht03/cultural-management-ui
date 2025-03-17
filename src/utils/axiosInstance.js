import axios from 'axios';
import { message } from 'antd';
const API_URL = 'http://192.168.100.47:2003/api/';
// const API_URL = 'https://localhost:7024/api/';
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Biến kiểm soát chỉ làm mới token một lần duy nhất
let isRefreshing = false;
let refreshSubscribers = [];
// Hàm đợi đến khi token mới được cập nhật
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};
// Khi token mới được nhận, cập nhật lại tất cả request đang chờ
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
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
    console.error('🚨 API Error:', error); // Log lỗi tổng quát
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn('⚠️ 401 Unauthorized detected! Attempting token refresh...');
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('🔍 Current refresh token:', refreshToken);
        if (!refreshToken) {
          console.error('❌ No refresh token found, logging out...');
          isRefreshing = false;
          localStorage.setItem('token', '');
          localStorage.setItem('refreshToken', '');
          message.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!');
          // window.location.href = '/';
          return Promise.reject(new Error('No refresh token available'));
        }

        try {
          const refreshResponse = await axiosInstance.post('/v1/HeThongNguoiDung/LamMoiToken', { RefreshToken: refreshToken });
          if (refreshResponse.data.Status === 1) {
            const newAccessToken = refreshResponse.data.Data;
            const newRefreshToken = refreshResponse.data.RefreshToken;

            localStorage.setItem('token', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            isRefreshing = false;
            onRefreshed(newToken);

            // Cập nhật request gốc với token mới
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } else {
            throw new Error('❌ Token refresh failed: Invalid response status');
          }
        } catch (refreshError) {
          console.error('🚨 Error refreshing token:', refreshError);
          localStorage.setItem('token', '');
          localStorage.setItem('refreshToken', '');
          message.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!');
          // window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }


      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    console.error('❌ API request failed:', error);
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
