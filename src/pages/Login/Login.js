import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Login.css';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../utils/axiosInstance';
import anh from '../../assets/img/anh copy.jpg';
const Login = () => {
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 
  const onFinish = async (values) => {
    setLoading(true);
    const { userName, password } = values;
    try {
      const response = await axiosInstance.post(`/SysUsers/Login`, {
        UserName: userName,
        Password: password,
      });

      if (response.data.status === 1) {
        const { token, refreshToken } = response.data;

        // Decode the token to verify and extract user information
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        // Save tokens to localStorage
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);

        message.success('Login successful!');

        // Redirect and fetch data on the dashboard
        navigate('/dashboard');
      } else {
        message.error(response.data.message || 'Invalid username or password!');
      }
    } catch (error) {
      message.error('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Phần mềm quản lý cơ sở dữ liệu chuyên ngành Văn hóa và Thể thao</h1>
      </header>
      <div className="login-box">
        <div className="login-image">
          <img src={anh} alt="Description" />
        </div>
        <div className="login-form">
          <Form
            name="login"
            onFinish={onFinish}
            style={{ width: '300px', margin: 'auto', padding: '50px' }}
          >
            <h2>ĐĂNG NHẬP</h2>
            <Form.Item
              label="Tên đăng nhập"
              name="userName" 
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: 'Xin vui lòng nhập tài khoản!' }]}
            >
              <Input placeholder="Tài khoản" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password" 
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                Đăng nhập
              </Button>
            </Form.Item>
            <Form.Item>
              <a href="/forgot-password">Quên mật khẩu?</a>
            </Form.Item>
            <div className="support-info">
              <p>Hỗ trợ thông tin</p>
              <p>Điện thoại: ----</p>
              <p>Email: ----@gosol.com.vn</p>
              <p><a href="/teamview-download">Tải phần mềm Teamview</a></p>
              <p><a href="/ultraview-download">Tải phần mềm Ultraview</a></p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Login;
