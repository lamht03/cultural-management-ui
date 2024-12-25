import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  BellOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {Drawer,Dropdown,Menu,message,Modal,Form,Input,Button,} from 'antd';
import logo from '../../../assets/img/logo.png';

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

const Header = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const showDrawer = () => {
    setDrawerOpen(true);
  };
  const onClose = () => {
    setDrawerOpen(false);
  };
  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      message.info('Đăng xuất thành công!');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/'); // Điều hướng đến trang chủ
    } else if (e.key === 'changePassword') {
      setModalOpen(true); // Hiển thị modal đổi mật khẩu
    }
  };
  const handleChangePassword = () => {
    form
      .validateFields()
      .then((values) => {
        // Gửi yêu cầu đổi mật khẩu qua API
        console.log('Submitted values:', values);
        message.success('Đổi mật khẩu thành công!');
        setModalOpen(false); // Đóng modal
        form.resetFields(); // Xóa dữ liệu trong form
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };
  const handleCancel = () => {
    setModalOpen(false); // Đóng modal
    form.resetFields(); // Xóa dữ liệu trong form
  };
  const notificationMenu = (
    <Menu
  items={[
    {
      key: 'ThongBao',
      label: (
        <div>
          <b style={{ fontSize: '14px',marginLeft: '60px' }}>Thông báo</b> <br />
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
  return (
    <div style={headerStyle}>
      {/* Logo và tên UBND Tỉnh */}
      <div style={logoStyle}>
        <Link to="/dashboard">
          <img src={logo} alt="Logo" style={logoIconStyle} />
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={titleStyle}>UBND Tỉnh</span>
        </Link>
      </div>
      {/* Tiêu đề */}
      <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#000' }}>
        QUẢN LÝ VĂN HÓA
      </div>
      {/* Biểu tượng */}
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

      {/* Modal đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
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
            <Button type="primary" onClick={handleChangePassword}>
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