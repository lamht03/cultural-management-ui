import axios from 'axios';
const API_URL = 'https://localhost:7024/api';
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
// Interceptor cho yêu cầu để thêm token vào headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Interceptor cho phản hồi để xử lý việc làm mới token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Kiểm tra lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã retry 1 lần
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(error);
      }
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axiosInstance.post('/v1/HeThongNguoiDung/LamMoiToken', {
            RefreshToken: refreshToken,
          });
          if (response.data.Status === 1) {
            const { RefreshToken: newRefreshToken, Data: newToken } = response.data;
            // Lưu token mới
            localStorage.setItem('token', newToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            isRefreshing = false;
            onRefreshed(newToken);

            // Cập nhật request gốc với token mới
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } else {
            throw new Error('Refresh token không hợp lệ');
          }
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
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
    return Promise.reject(error);
  }
);
export default axiosInstance;
