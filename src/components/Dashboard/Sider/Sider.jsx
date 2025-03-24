import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuComponent from '../../Menu/Menu.Sider.jsx'; // Import MenuComponent từ Menu.js
const { Sider } = Layout;
const menuItems = [
  {
    key: 'heThong',
    label: <strong>Hệ thống</strong>,
    children: [
      { key: 'quanLyNguoiDung', label: 'Quản lý dữ liệu người dùng', path: '/dashboard/quan-ly-nguoi-dung' },
      { key: 'phanQuyen', label: 'Quản lý phân quyền', path: '/dashboard/phan-quyen' },
      
    ],
  },
  {
    key: 'quanLyDanhMuc',
    label: <strong>Quản lý danh mục</strong>,
    children: [
      { key: 'danhMucCoQuan', label: 'Danh mục cơ quan, đơn vị', path: '/dashboard/danh-muc-co-quan' },
      { key: 'danhMucChiTieu', label: 'Danh mục chỉ tiêu', path: '/dashboard/danh-muc-chi-tieu' },
      { key: 'danhMucCot', label: 'Danh mục cột báo cáo', path: '/dashboard/danh-muc-cot' },
      { key: 'danhMucKyBaoCao', label: 'Danh mục kỳ báo cáo', path: '/dashboard/danh-muc-ky-bao-cao' },
      { key: 'danhMucCapDiTichXepHang', label: 'Danh Mục Cấp Di Tích Xếp Hạng', path: '/dashboard/danh-muc-cap-di-tich-xep-hang' },
      { key: 'danhmuloaiditich', label: 'Danh mục loại di tích', path: '/dashboard/danh-muc-loai-di-tich' },
      { key: 'danhmucdonvitinh', label: 'Danh mục đơn vị tính  ', path: '/dashboard/danh-muc-don-vi-tinh' },
      { key: 'danhmucloaimauphieu', label: 'Danh mục loại mẫu phiếu  ', path: '/dashboard/danh-muc-loai-mau-phieu' },
    ],
  },
  {
    key: 'HTTT',
    label: <strong>Quản lý HTTT tổng hợp báo cáo</strong>,
    children: [
      { key: 'danhMucCoQuan1', label: 'Thiết lập mẫu báo cáo', path: '/dashboard/mau-phieu' },
      
    ],
  },
];
const SiderMenu = () => {
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    const keys = [];
    const findKey = (items) => {
      for (const item of items) {
        if (item.children) {
          for (const child of item.children) {
            if (child.path === path) {
              keys.push(item.key);
              keys.push(child.key);
              return;
            }
          }
        }
      }
    };
    findKey(menuItems);
    setSelectedKeys([keys.pop()]);
    setOpenKeys(keys);
  }, [location.pathname]);
  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };
  const handleClick = (e) => {
    setSelectedKeys([e.key]);
    const path = e.item.props.path;
    if (path) {
      navigate(path);
    }
  };
  return (
    <Sider width={250} style={{ background: '#fff', minHeight: '100vh' }}>
      <MenuComponent
        menuItems={menuItems}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        handleOpenChange={handleOpenChange}
        handleClick={handleClick}
      />
    </Sider>
  );
};
export default SiderMenu;
