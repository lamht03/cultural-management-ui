import React from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom'; 
import CustomHeader from '../../components/Dashboard/Header/Header';
import CustomFooter from '../../components/Dashboard/Footer/Footer';
import CustomSider from '../../components/Dashboard/Sider/Sider';
import CustomContent from '../../components/Dashboard/Content/Content';
import Nguoidung from '../../components/Dashboard/Content/Nguoidung';
import Phanquyen from '../../components/Dashboard/Content/Phanquyen';
import Donvi from '../../components/Dashboard/Content/Donvi';
import Chitieu from '../../components/Dashboard/Content/Chitieu'; 
import TieuChi from '../../components/Dashboard/Content/TieuChi';
import Thoigian from '../../components/Dashboard/Content/thoigian';
import Xephang from '../../components/Dashboard/Content/Xephang';
import Ditich from '../../components/Dashboard/Content/Ditich';
import Mauphieu from '../../components/Dashboard/Content/Mauphieu';
import QuanMauphieu from '../../components/Dashboard/Content/QuanMauphieu'; 
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
        // Danh Mục Loại Mẫu Phiếu
        case '/dashboard/danh-muc-loai-mau-phieu': // Case for Chitieu
        return <Mauphieu />;
        case '/dashboard/mau-phieu': 
      // Quản Lý Mẫu Phiếu
        return <QuanMauphieu />;
        
       
        case '/dashboard/danh-muc-don-vi-tinh':
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