// Sider.js
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuComponent from '../../Menu/Menu.Sider.js'; // Import MenuComponent từ Menu.js
const { Sider } = Layout;
const menuItems = [
  {
    key: 'heThong',
    label: <strong>Hệ thống</strong>,
    children: [
      { key: 'quanLyNguoiDung', label: 'Quản lý dữ liệu người dùng', path: '/dashboard/quan-ly-nguoi-dung' },
      { key: 'phanQuyen', label: 'Quản lý phân quyền', path: '/dashboard/phan-quyen' },
      { key: 'thamSoHeThong', label: 'Quản lý truy cập, tham số', path: '/dashboard/tham-so-he-thong' },
      { key: 'nhatKyHeThong', label: 'Nhật ký sử dụng', path: '/dashboard/nhat-ky-he-thong' },
      { key: 'saoLuuDuLieu', label: 'Sao lưu, phục hồi dữ liệu', path: '' },
      { key: 'taiLieuHuongDan', label: 'Quản lý hướng dẫn sử dụng', path: '/dashboard/tai-lieu-huong-dan' },
      { key: 'cauHinhDangNhap', label: 'Cấu hình đăng nhập hệ thống', path: '' },
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
      { key: 'danhmucdisanvanhoa', label: 'Danh mục dị sản văn hóa', path: '/dashboard/danh-muc-di-san-van-hoa' },
      { key: 'danhmucloaituleu', label: 'Danh mục di sản tư liệu  ', path: '/dashboard/danh-muc-di-san-tu-lieu' },
      { key: 'danhmucloaidíanvanhoaphivatthe', label: 'Danh mục di sản văn hóa  phi vật thể', path: '/dashboard/di-san-van-hoa-phi-vat-the' }, 
      { key: 'danhmucdonvitinh', label: 'Danh mục đơn vị tính  ', path: '/dashboard/danh-muc-don-vi-tinh' },
      { key: 'danhmucloaimauphieu', label: 'Danh mục loại mẫu phiếu  ', path: '/dashboard/danh-muc-loai-mau-phieu' },
    ],
  },
  {
    key: 'HTTT',
    label: <strong>Quản lý HTTT tổng hợp báo cáo</strong>,
    children: [
      { key: 'danhMucCoQuan1', label: 'Thiết lập mẫu báo cáo', path: '/dashboard/mau-phieu' },
      { key: 'danhMucChiTieu1', label: 'Cập nhật biểu mẫu số liệu', path: '/dashboard/cap-nhap-bieu-mau-du-lieu' },
      { key: 'danhMucCot1', label: 'Quản lý di tích toàn tỉnh', path: '/dashboard/quan-ly-di-tich-toan-tinh' },
      { key: 'danhMucKyBaoCao1', label: 'Danh mục di sản văn hóa  phi vật thể', path: '/dashboard/quan-ly-di-san-van-hoa-phi-vat-the' },
      { key: 'danhMucCapDiTichXepHang1', label: 'Quản lý bảo vật quốc gia', path: '/dashboard/quan-ly-bao-vat-quoc-gia' },
      { key: 'danhmuloaiditich1', label: 'Quản lý nghệ nhân', path: '/dashboard/quan-ly-nghe-nhan' },
      { key: 'danhmucdisanvanhoa1', label: 'Quản lý bảo tàng', path: '/dashboard/quan-ly-bao-tang' },
      { key: 'danhmucloaituleu1', label: 'quản lý hện vật bảo tàng', path: '/dashboard/quan-ly-hien-vat-bao-tang' },
      { key: 'danhmucloaidíanvanhoaphivatthe1', label: 'quản lý di sản tư liệu', path: '/dashboard/quan-ly-di-san-tu-lieu' }, 
      { key: 'danhmucdonvitinh1', label: 'Quản Lý Thư Viện  ', path: '/dashboard/quan-ly-thu-vien' },
      { key: 'danhmucloaimauphieu1', label: 'Quản Lý Nhân Lực thư viện', path: '/dashboard/quan-ly-nhan-luc-thu-vien' },
    ],
  },
  {
    key: 'CNCT',
    label: <strong>Cập nhập chi tiết biểu mẫu số liệu</strong>,
    children: [
      { key: 'danhMucCoQuan1', label: 'Cấu hình nhập  báo cáo Chi tiết', path: '/dashboard/cap-nhap-cau-hinh-nhap-bao-cao-chi-tiet' },
      { key: 'danhMucChiTieu1', label: ' Bảo tàng', path: '/dashboard/cap-nhap-bao-tang' },
      { key: 'danhMucCot1', label: 'Cập nhập di sản văn hóa phi vật thể', path: '/dashboard/cap-nhap-di-san-phi-vat-the' },
      { key: 'danhMucKyBaoCao1', label: 'Hệ thống thiết chế văn hóa ', path: '/dashboard/cap-nhap-thiet-che-van-hoa' },
      { key: 'danhMucCapDiTichXepHang1', label: 'Hệ thống thư viện', path: '/dashboard/cap-nhap-thu-vien' },
      { key: 'danhmuloaiditich1', label: 'Nghệ thuật biểu diễn', path: '/dashboard/cap-nhap-nghe-thuat-bieu-dien' },
      { key: 'danhmucdisanvanhoa1', label: 'Mỹ thuật nhiệp ảnh triển lãm', path: '/dashboard/cap-nhap-my-thuat' },
      { key: 'danhmucloaituleu1', label: 'Gia đình', path: '/dashboard/cap-nhap-gia-dinh' },
      { key: 'danhmucloaidíanvanhoaphivatthe1', label: 'Phòn trào toàn dân đoàn kết ', path: '/dashboard/cap-nhap-phong-trao' }, 
      { key: 'danhmucdonvitinh1', label: 'Thể dục thể thao ', path: '/dashboard/cap-nhap-the-duc-the-thao' },
      { key: 'danhmucloaimauphieu1', label: 'Thanh tra', path: '/dashboard/cap-nhap-thanh-tra' },
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
