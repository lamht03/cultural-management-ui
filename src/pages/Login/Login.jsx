import React, { useState } from 'react';
import { Form, Input, Button, message ,Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../utils/axiosInstance';
import '../../assets/css/Login.css';
import anh from '../../assets/img/anh copy.jpg';

const Login = () => {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState(''); // Đổi tên biến từ 'string' thành 'email' cho rõ ràng hơ
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleModalOk = async () => {
    try {
      // Gửi email để đặt lại mật khẩu
      const response = await axiosInstance.post('/v1/HeThongNguoiDung/QuenMatKhau', { email });
      if (response.data.status === 1) {
        message.success('Email đặt lại mật khẩu đã được gửi!');
        setModalVisible(false);
        setEmail(''); // Reset email input after successful submission
      } else {
        message.error(response.data.message || 'Đã xảy ra lỗi!');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      message.error('Đã xảy ra lỗi khi gửi email. Vui lòng thử lại!');
    }
  };
  const onFinish = async (values) => {
    setLoading(true);
    const { TenNguoiDung, MatKhau } = values;

    try {
      const response = await axiosInstance.post(`/v1/HeThongNguoiDung/DangNhap`, {
        TenNguoiDung: TenNguoiDung,
        MatKhau: MatKhau,
      });

      if (response.data.status === 1) {
        const { token, refreshToken } = response.data;

        // Decode token to extract user information
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        // Save tokens to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        message.success('Đăng nhập thành công!');

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        message.error(response.data.message || 'Sai tài khoản hoặc mật khẩu!');
      }
    } catch (error) {
      console.error('Login Error:', error);
      message.error('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = () => {
    setModalVisible(true);
  };
  return (
    <div className="login-container">
      <header className="login-header">
        <h1 className="login-title">Phần mềm quản lý cơ sở dữ liệu chuyên ngành Văn hóa và Thể thao</h1>
      </header>
      <div className="login-box">
        <div className="login-image">
          <img src={anh} alt="Login Illustration" />
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
              name="TenNguoiDung"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: 'Xin vui lòng nhập tài khoản!' }]}
            >
              <Input placeholder="Tài khoản" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="MatKhau"
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
            <a onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>Quên mật khẩu?</a>
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
      <Modal
  title="Quên mật khẩu"
  visible={modalVisible}
  onOk={handleModalOk}
  onCancel={() => setModalVisible(false)}
>
  <Form>
    <Form.Item
      label="Email"
      name="string" // Sửa lại để chỉ định tên cho trường
      rules={[{ required: true, message: 'Xin vui lòng nhập email!' }]} // Đặt rules đúng cách
    >
      <Input 
        type="string" 
        placeholder="Nhập email của bạn" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
    </Form.Item>
  </Form>
</Modal>
    </div>
  );
};
export default Login;