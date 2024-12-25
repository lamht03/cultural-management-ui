import React from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom'; // Import Link for navigation
import CustomHeader from '../../components/Dashboard/Header/Header';
import CustomFooter from '../../components/Dashboard/Footer/Footer';
import CustomSider from '../../components/Dashboard/Sider/Sider';
import CustomContent from '../../components/Dashboard/Content/Content';
import Nguoidung from '../../components/Dashboard/Content/Nguoidung';
import Phanquyen from '../../components/Dashboard/Content/Phanquyen';
import Thamso from '../../components/Dashboard/Content/Thamso';
import Nhaty from '../../components/Dashboard/Content/Nhatky';
import Huongdan from '../../components/Dashboard/Content/Huongdan';
import Donvi from '../../components/Dashboard/Content/Donvi';
import Chitieu from '../../components/Dashboard/Content/Chitieu'; 
import TieuChi from '../../components/Dashboard/Content/TieuChi';
import Thoigian from '../../components/Dashboard/Content/thoigian';
import Xephang from '../../components/Dashboard/Content/Xephang';
import Ditich from '../../components/Dashboard/Content/Ditich';
import Vanhoa from '../../components/Dashboard/Content/Vanhoa';
import Tulieu from '../../components/Dashboard/Content/Tulieu';
import Vatthe from '../../components/Dashboard/Content/Vatthe';
import Mauphieu from '../../components/Dashboard/Content/Mauphieu';
import QuanMauphieu from '../../components/Dashboard/Content/QuanMauphieu'; 
import Solieu from '../../components/Dashboard/Content/Solieu';
import Tinh from '../../components/Dashboard/Content/Tinh';
import Vatthe1 from '../../components/Dashboard/Content/Vatthe1' ;
import Quocgia from '../../components/Dashboard/Content/Quocgia';
import Nghenhan from '../../components/Dashboard/Content/Nghenhan';
import Baotang from '../../components/Dashboard/Content/Baotang';
import Baotang1 from '../../components/Dashboard/Content/Baotang1';
import Tulieu1 from '../../components/Dashboard/Content/Tulieu1';
import Thuvien from '../../components/Dashboard/Content/Thuvien';
import Thuvien1 from '../../components/Dashboard/Content/Thuvien1';
import Chitiet from '../../components/Dashboard/Content/Chitiet';
import Baotang2 from '../../components/Dashboard/Content/Baotang2';
import Vatthe2 from '../../components/Dashboard/Content/Vatthe2' ;
import Vanhoa1 from '../../components/Dashboard/Content/VanHoa1';
import Thuvien2 from '../../components/Dashboard/Content/Thuvien2';
import Bieudien from '../../components/Dashboard/Content/Bieudien';
import Mythuat from '../../components/Dashboard/Content/MyThuat';
import Giadinh from '../../components/Dashboard/Content/Giadinh';
import TheThao from '../../components/Dashboard/Content/TheThao';
import Thanhtra from '../../components/Dashboard/Content/Thanhtra';
import Phongtrao from '../../components/Dashboard/Content/Phongtrao';
import Donvitinh from '../../components/Dashboard/Content/Donvitinh';
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
  height: '100vh',
};
const Dashboard = () => {
  const location = useLocation(); // Get the current route location
  // Function to render the correct content based on the route
  const renderContent = () => {
    switch (location.pathname) {
      // dashboard
      case '/dashboard':
        return <CustomContent />;
        // QUẢN LÝ NGƯỜI DÙNG
      case '/dashboard/quan-ly-nguoi-dung':
        return <Nguoidung />;
        // QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG
      case '/dashboard/phan-quyen':
        return <Phanquyen />;
        // QUẢN LÝ  THAM SỐ HỆ THỐNG 
      case '/dashboard/tham-so-he-thong':
        return <Thamso />;
       // Nhật ký hệ thống
      case '/dashboard/nhat-ky-he-thong':
        return <Nhaty />;
        // tài liệu hướng dẫn
      case '/dashboard/tai-lieu-huong-dan':
        return <Huongdan />;
        // DANH MỤC CƠ QUAN, ĐƠN VỊ
      case '/dashboard/danh-muc-co-quan': // Case for Donvi
        return <Donvi />;
        // Danh mục chỉ tiêu
      case '/dashboard/danh-muc-chi-tieu': // Case for Chitieu
        return <Chitieu />;
        // Danh mục tiêu chí
        case '/dashboard/danh-muc-cot': // Case for Chitieu
        return <TieuChi />;
        // Danh mục thời gian
        case '/dashboard/danh-muc-ky-bao-cao': // Case for Chitieu
        return <Thoigian />;
        // Danh Mục Cấp Di Tích Xếp Hạng
        case '/dashboard/danh-muc-cap-di-tich-xep-hang': // Case for Chitieu
        return <Xephang />;
        // Danh Mục Loại Di Tích
        case '/dashboard/danh-muc-loai-di-tich': // Case for Chitieu
        return <Ditich />;
        // QUẢN LÝ DANH MỤC DI SẢN VẤN HỢA
        case '/dashboard/danh-muc-di-san-van-hoa': // Case for Chitieu
        return <Vanhoa />;
        // QUẢN LÝ DANH MỤC DI SẢN TƯ LIỆU
        case '/dashboard/danh-muc-di-san-tu-lieu': // Case for Chitieu
        return <Tulieu />;
        case '/dashboard/di-san-van-hoa-phi-vat-the': // Case for Chitieu
        // 
        // QUẢN LÝ DANH MỤC DI SẢN VĂN HÓA PHI VẬT THỂ
        return <Vatthe />;
        // Danh Mục Loại Mẫu Phiếu
        case '/dashboard/danh-muc-loai-mau-phieu': // Case for Chitieu
        return <Mauphieu />;
        case '/dashboard/mau-phieu': 
      // Quản Lý Mẫu Phiếu
        return <QuanMauphieu />;

        case '/dashboard/cap-nhap-bieu-mau-du-lieu': 
        //CẬP NHẬT BIỂU MẪU SỐ LIỆU
        return <Solieu />;
        case '/dashboard/quan-ly-di-tich-toan-tinh':
          //QUẢN LÝ DI TÍCH TOÀN TỈNH
        return <Tinh />;
        case '/dashboard/quan-ly-di-san-van-hoa-phi-vat-the': 
        // QUẢN LÝ DI SẢN VẤN HỢA PHI VẬT THỂ
        return <Vatthe1 />;
        case '/dashboard/quan-ly-bao-vat-quoc-gia': 
        // QUẢN LÝ BẢO VẬT QUỐC GIA
        return <Quocgia />;
        case '/dashboard/quan-ly-nghe-nhan': 
        // QUẢN LÝ NGHỆ NHÂN DI SẢN VĂN HÓA PHI VẬT THỂ 
        return <Nghenhan />;
        case '/dashboard/quan-ly-bao-tang':
        // QUẢN LÝ BẢO TÀNG
        return <Baotang />;
        case '/dashboard/quan-ly-hien-vat-bao-tang': 
        // QUẢN LÝ HIỆN VẤT BẢO TÀNG
        return <Baotang1 />;
        case '/dashboard/quan-ly-di-san-tu-lieu': 
        // QUẢN LÝ DI SẢN TƯ LIỆU
        return <Tulieu1 />;
        case '/dashboard/quan-ly-thu-vien': 
        // QUẢN LÝ THƯ VIỆN
        return <Thuvien />;
        case '/dashboard/quan-ly-nhan-luc-thu-vien': 
        // QUẢN LÝ NHÂN LỰC THƯ VIỆN<
        return <Thuvien1 />;
        case '/dashboard/cap-nhap-cau-hinh-nhap-bao-cao-chi-tiet': 
       // QUẢN LÝ DANH SÁCH CẤU HÌNH NHẬP CHỈ TIÊU BÁO CÁO CHI TIẾT
        return <Chitiet />;
        case '/dashboard/cap-nhap-bao-tang': 
        //QUẢN LÝ HOẠT ĐÔNG BẢO TÀNG 
        return <Baotang2 />;
        case '/dashboard/cap-nhap-di-san-phi-vat-the': 
        // CẬP NHẬP  DI SẢN VĂN HÓA PHI VẬT THỂ
        return <Vatthe2 />;
        case '/dashboard/cap-nhap-thiet-che-van-hoa': 
        //CẬP NHẬT THIẾT CHẾ VĂN HÓA
        return <Vanhoa1 />;
        case '/dashboard/cap-nhap-thu-vien':
          //CẬP  NHẬP THƯ VIỆN
        return <Thuvien2 />;
        case '/dashboard/cap-nhap-nghe-thuat-bieu-dien': 
        // CẬP NHẬT NGHỆ THUẬT BIỂU DIỆN
        return <Bieudien />;
        case '/dashboard/cap-nhap-my-thuat': 
        // CẬP NHẬT Mỹ THUẬT
        return <Mythuat />;
        case '/dashboard/cap-nhap-gia-dinh': 
        // CẬP NHẬT GIA ĐÌNH
        return <Giadinh />;
        case '/dashboard/cap-nhap-the-duc-the-thao': 
        // CẬP NHẬT THỂ DỤC THỂ THAO
        return <TheThao />;
        case '/dashboard/cap-nhap-thanh-tra': 
        // CẬP NHẬT THANH TRA
        return <Thanhtra />;
        case '/dashboard/cap-nhap-phong-trao': 
        // CẬP NHẬT PHONG TRÀO
        return <Phongtrao />;
        case '/dashboard/danh-muc-don-vi-tinh':
          // 
        return <Donvitinh/>
      default:
        return <CustomContent />;
    }
  };
  return (
    <Layout style={layoutStyle}>
      <CustomHeader />
      <Layout>
        <CustomSider />
        <Layout.Content style={{ padding: '20px', backgroundColor: '#fff' }}>
          {renderContent()}
        </Layout.Content>
      </Layout>
      <CustomFooter />
    </Layout>
  );
};
export default Dashboard;
