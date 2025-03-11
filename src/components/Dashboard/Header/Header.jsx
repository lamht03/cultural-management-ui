import React, { useState, useEffect } from 'react';
import { data, Link, useNavigate } from 'react-router-dom';
import {LockOutlined,UserOutlined,BellOutlined,QuestionCircleOutlined,} from '@ant-design/icons';
import { Drawer, Dropdown, Menu, message, Modal, Form, Input, Button } from 'antd';
import logo from '../../../assets/img/logo.png';
import axiosInstance from '../../../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // State to hold user info

  const showDrawer = () => {
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
  };

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      message.info('Đăng xuất thành công!');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/'); // Navigate to home page
    } else if (e.key === 'changePassword') {
      setModalOpen(true); // Show change password modal
    }
  };

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/v1/HeThongNguoiDung/TimKiemNguoiDungTheoID?userId=${userId}` // Use the dynamic userId
      );

      if (response.data.Status === 1) {
        console.log('Thông tin người dùng:', response.data.Data);
        setUserInfo(response.data.Data); // Set user info to state
      } else {
        console.error('Lỗi:', response.data.Message);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    }
  };

  const handleUpdatePassword = async (values) => {
    try {
      // Retrieve the access token from localStorage
      const accessToken = localStorage.getItem('token');
      if (!accessToken) {
        message.error("Bạn chưa đăng nhập!");
        // Optionally, redirect to the login page
        return;
      }
  
      // Client-side check: Ensure new password and confirm password match
      if (values.MatKhauMoi !== values.XacNhanMatKhauMoi) {
        message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
      }
  
      // Make the API call with the token in the header
      const response = await axiosInstance.post(
        '/v1/HeThongNguoiDung/DoiMatKhau',
        {
          MatKhauCu: values.MatKhauCu,
          MatKhauMoi: values.MatKhauMoi,
          XacNhanMatKhauMoi: values.XacNhanMatKhauMoi,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      // Check the API response
      if (response.data.Status === 1) {
        message.success('Mật Khẩu thay đổi thành công!');
        return;
      } else {
        message.error(response.data.Message);
        return;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.Message || "Đã xảy ra lỗi khi đổi mật khẩu!";
      message.error(errorMessage);
      console.error("Error changing password:", error);
    }
  };  
  const handleCancel = () => {
    setModalOpen(false); // Close modal
    form.resetFields(); // Clear form data
  };

  const notificationMenu = (
    <Menu
      items={[
        {
          key: 'ThongBao',
          label: (
            <div>
              <b style={{ fontSize: '14px', marginLeft: '60px' }}>Thông báo</b> <br />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellOutlined /> Không có thông báo nhắc việc
              </div>
            </div>
          ),
        },
      ]}
    />
  );

  const userMenu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: 'changePassword',
          label: 'Đổi mật khẩu',
        },
        {
          key: 'logout',
          label: 'Đăng xuất',
        },
      ]}
    />
  );

  useEffect(() => {
    const access_token = localStorage.getItem('accessToken');
    if (access_token) {
      const decodedToken = jwtDecode(access_token);
      const userId = decodedToken.NguoiDungID; // Extract NguoiDungID from token
      fetchUserInfo(userId); // Fetch user info on component mount
    }
  }, []);
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '0 16px',
    height: 64,
    borderBottom: '1px solid #ccc',
  };
  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  };
  const logoIconStyle = {
    width: 40,
    height: 40,
    marginRight: 8,
  };
  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#000',
    marginTop: -90,
  };
  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };
  const iconStyle = {
    fontSize: '25px',
    cursor: 'pointer',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <div style={headerStyle}>
      {/* Logo and name */}
      <div style={logoStyle}>
        <Link to="/dashboard">
          <img src={logo} alt="Logo" style={logoIconStyle} />
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={titleStyle}>UBND Tỉnh</span>
        </Link>
      </div>
      {/* Title */}
      <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#000' }}>
        QUẢN LÝ VĂN HÓA
      </div>
      {/* Icons */}
      <div style={rightSectionStyle}>
        <span style={iconStyle} onClick={showDrawer}>
          <QuestionCircleOutlined />
        </span>
        <Dropdown overlay={notificationMenu} trigger={['click']}>
          <span style={iconStyle}>
            <BellOutlined />
          </span>
        </Dropdown>
        <Dropdown overlay={userMenu} trigger={['click']}>
          <span style={iconStyle}>
            <UserOutlined />
          </span>
        </Dropdown>
      </div>
      {/* Drawer */}
      <Drawer
        title="Hướng dẫn"
        placement="right"
        onClose={onClose}
        open={isDrawerOpen}
      >
        <p>Chưa có hướng dẫn cho chức năng này</p>
      </Drawer>

      {/* Change Password Modal */}
      <Modal
        title="Đổi mật khẩu"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdatePassword}>
          <Form.Item
            label="Mật khẩu hiện tại"
            name="MatKhauCu" // Field name must match payload
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="MatKhauMoi" // Field name must match payload
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="XacNhanMatKhauMoi"
            dependencies={['MatKhauMoi']}
            rules={[
              { required: true, message: 'Vui lòng nhập xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('MatKhauMoi') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đổi mật khẩu
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Header;