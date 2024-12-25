import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, Select, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axiosInstance'; // Import axios
import '../../../assets/css/Nguoidung.css'; // File CSS for table styling

const { Content } = Layout;
const { Search } = Input;

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    align: 'center',
    render: (_, __, index) => index + 1, // Show index + 1 for serial number
  },
  {
    title: 'Họ và tên',
    dataIndex: 'FullName',
    key: 'FullName',
    align: 'left',
  },
  {
    title: 'Tên tài khoản',
    dataIndex: 'UserName',
    key: 'UserName',
    align: 'left',
  },
  {
    title: 'Ngày sinh',
    dataIndex: '',
    key: '',
    align: 'left',
  },
  {
    title: 'Giới tính	',
    dataIndex: '',
    key: 'Note',
    align: 'left',
  },
  {
    title: 'Địa chỉ	',
    dataIndex: '',
    key: 'Note',
    align: 'left',
  },
  {
    title: 'Cơ quan	',
    dataIndex: '',
    key: 'Note',
    align: 'left',
  },
  {
    title: 'Thao tác',
    key: 'actions',
    align: 'center',
    render: (_, record) => (
      <span>
        <Button type="link"
        style={{ color: "black", fontSize: "20px" }}>
          <EditOutlined />
        </Button>
        <Button type="link" danger
        style={{ color: "black", fontSize: "20px" }}>
          <DeleteOutlined />
        </Button>
        <Button type="link" danger
        style={{ color: "black", fontSize: "20px" }}>
          <RollbackOutlined />
        </Button>
      </span>
    ),
  },
];

const contentStyle = {
  width: '100%',
  height: '800px',
  color: '#000',
  backgroundColor: '#fff',
  borderRadius: 1,
  border: '1px solid #ccc',
  padding: '20px',
};

const Nguoidung = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchGender, setSearchGender] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/SysUsers/UsersList', {
        params: { pageNumber: 1, pageSize: 20 },
      });
      if (response.data.Status === 1) {
        const formattedData = response.data.Data.map((item, index) => ({
          key: item.UserID,
          stt: index + 1,
          FullName: item.FullName || 'N/A', // Handle null values
          UserName: item.UserName,
          Email: item.Email,
          Note: item.Note || '',
        }));
        setData(formattedData);
      } else {
        message.error('Failed to fetch user data.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => setSearchName(e.target.value);
  const handleGenderChange = (value) => setSearchGender(value);

  const onSearch = (value) => setSearchName(value);

  const filteredData = data.filter((item) => {
    return (
      item.FullName.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchGender ? item.gioiTinh === searchGender : true)
    );
  });

  return (
    
      <Content style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: 19 }}>QUẢN LÝ NGƯỜI DÙNG</h1>
          <Button type="primary">Thêm</Button>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <Select
            allowClear
            placeholder="Chọn giới tính"
            value={searchGender}
            onChange={handleGenderChange}
            style={{ width: '200px' }}
          >
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
          </Select>
          <Search
            placeholder="Nhập tên cán bộ hoặc cơ quan"
            allowClear
            value={searchName}
            onSearch={onSearch}
            onChange={handleNameChange}
            style={{
              width: 200,
            }}
          />
        </div>

        {loading ? (
          <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
        ) : (
          <Table
            className="custom-table"
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 5 }}
          />
        )}
      </Content>
    
  );
};

export default Nguoidung;
