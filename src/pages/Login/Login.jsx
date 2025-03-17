import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Login.css';
import anh from '../../assets/img/anh copy.jpg';
import axiosInstance from '../../utils/axiosInstance'; // Assuming you still want to keep the API call for password recovery
const Login = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Create a form instance
  const handleModalOk = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/v1/HeThongNguoiDung/QuenMatKhau', { email });
      const status = response.data.status ?? response.data.Status;
      const messageText = response.data.message ?? response.data.Message;
      if (status === 1) {
        message.success(messageText || 'Mật khẩu mới đã được gửi đến email của bạn!');
        setModalVisible(false);
        setEmail('');
      } else {
        const errorMessage = messageText || 'Không tìm thấy tài khoản với email này!';
        message.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.Message 
        || 'Đã xảy ra lỗi khi gửi email. Vui lòng thử lại!';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const login = async () => {
    setLoading(true);
    const values = form.getFieldsValue(); // Get form values
    const { TenNguoiDung, MatKhau } = values;
    try {
      // Make API call to login
      const response = await axiosInstance.post('/v1/HeThongNguoiDung/DangNhap', {
        TenNguoiDung,
        MatKhau,
      });
      if (response.data.status === 1) {
        const { token, refreshToken } = response.data;
        // Save tokens to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        message.success('Đăng nhập thành công!');
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        message.error(response.data.Message || 'Sai tài khoản hoặc mật khẩu!');
      }
    } catch (error) {
      console.error('Login Error:', error);
      message.error('Sai tài khoản hoặc mật khẩu! hoặc lỗi sever');
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
        <h1 className="login-title font-bold text-2xl text-gray-800">
          Phần mềm quản lý cơ sở dữ liệu chuyên ngành Văn hóa và Thể thao
        </h1>
      </header>
      <div className="login-box">
        <div className="login-image">
          <img src={anh} alt="Login Illustration" />
        </div>
        <div className="login-form">
          <Form
            name="login"
            form={form} // Attach the form instance
            style={{ width: '300px', margin: 'auto', padding: '50px' }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">ĐĂNG NHẬP</h2>
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
              <Button 
                type="primary" 
                onClick={login} // Call the login function on click
                style={{ width: '100%' }} // Removed loading={loading}
              >
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
            name="email" // Changed from "string" to "email" for clarity
            rules={[{ required: true, message: 'Xin vui lòng nhập email!' }]}
          >
            <Input 
              type="email" 
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
