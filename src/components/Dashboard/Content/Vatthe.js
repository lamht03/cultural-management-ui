import React, { useState } from 'react';
import { Button, Layout, Table, Input } from 'antd';
import '../../../assets/css/Nguoidung.css'; // File CSS cho bảng
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Import icons
const { Content } = Layout;
const { Search } = Input; // Add this to import Search

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    align: 'center',
  },
  {
    title: 'Tên danh mục di sản văn hóa phi vật thể',
    dataIndex: 'hoTen',
    key: 'hoTen',
    align: 'left',
  },
  {
    title: 'Loại hình',
    dataIndex: 'tenTaiKhoan',
    key: 'tenTaiKhoan',
    align: 'left',
  },
  {
    title: 'Địa phương',
    dataIndex: 'ngaySinh',
    key: 'ngaySinh',
    align: 'left',
  },
  {
    title: "Thao tác",
    key: "actions",
    align: "center",
    render: (_, record) => (
      <span className="action-icons">
        <Button
          type="link"
          style={{ color: "black", fontSize: "20px" }}
          
        >
          <EditOutlined />
        </Button>
        <Button
          type="link"
          style={{ color: "black", fontSize: "20px" }}
          danger
          
        >
          <DeleteOutlined />
        </Button>
      </span>
    ),
  },
  
];

const dataSource = [
  {
    key: '1',
    stt: '1',
    hoTen: 'Nguyễn Văn A',
    tenTaiKhoan: 'nguyenvana',
    ngaySinh: '2000-01-01',
    gioiTinh: 'Nam',
    diaChi: '123 Đường ABC, TP.HCM',
    coQuan: 'Công ty XYZ',
  },
  {
    key: '2',
    stt: '2',
    hoTen: 'Trần Thị B',
    tenTaiKhoan: 'tranthib',
    ngaySinh: '1995-05-12',
    gioiTinh: 'Nữ',
    diaChi: '456 Đường DEF, Hà Nội',
    coQuan: 'Tập đoàn ABC',
  },
];

const contentStyle = {
  width: '100%',
  height: '100%',
  color: '#000',
  backgroundColor: '#fff',
  borderRadius: 1,
  border: '1px solid #ccc',
  padding: '20px',
};

const Nguoidung = () => {
  const [searchName, setSearchName] = useState('');
  const [searchGender, setSearchGender] = useState('');

  const handleNameChange = (e) => setSearchName(e.target.value);
  const handleGenderChange = (value) => setSearchGender(value);

  const onSearch = (value) => {
    setSearchName(value); // This will handle the search input
  };

  const filteredData = dataSource.filter(item => {
    return (
      item.hoTen.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchGender ? item.gioiTinh === searchGender : true)
    );
  });

  return (
   
      <Content style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="text-2xl font-bold mb-6 text-center">QUẢN LÝ DANH MỤC DI SẢN VĂN HÓA PHI VẬT THỂ
          </h1>
          <Button type="primary">Thêm</Button>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <Search
            placeholder="Tìm kiếm theo tên"
            allowClear
            value={searchName}
            onSearch={onSearch}
            onChange={handleNameChange}
            style={{
              width: 200,
            }}
          />
        </div>

        <Table
          className="custom-table"
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </Content>
  );
};

export default Nguoidung;
