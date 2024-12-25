import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, message, Popconfirm, Modal, Form, Checkbox, List } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axiosInstance';
import '../../../assets/css/Nguoidung.css';

const { Content } = Layout;
const { Search } = Input;
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
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState(null);
  const [showSettings, setShowSettings] = useState(false); // State to manage settings visibility
  const [users, setUsers] = useState([
    { id: 1, name: "tranviethung (Trần Việt Hưng - Sở Văn Hóa và Thể Thao)" },
  ]);
  const [permissions, setPermissions] = useState([
    { name: "Quản lý người sử dụng", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Quản lý phân quyền", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Quản lý truy cập, tham số", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Nhật ký sử dụng", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Sao lưu, phục hồi dữ liệu", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Quản lý hướng dẫn sử dụng", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Cấu hình đăng nhập hệ thống", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
  ]);

  // Fetch data from API
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/SysGroups/GroupsList?pageNumber=1&pageSize=20', {
        params: { pageNumber: 1, pageSize: 20 },
      });
      if (response.data.Status === 1) {
        const formattedData = response.data.Data.map((item, index) => ({
          key: item.GroupID,
          stt: index + 1,
          hoTen: item.GroupName,
          tenTaiKhoan: item.Description,
        }));
        setDataSource(formattedData);
      } else {
        message.error('Failed to fetch group data.');
      }
    } catch (error) {
      message.error('Error while fetching data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);
  
  // Open modal for adding or editing
  const showModal = (record = null) => {
    setEditRecord(record);
    form.resetFields();
    if (record) {
      form.setFieldsValue({ GroupName: record.hoTen, Description: record.tenTaiKhoan });
    }
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditRecord(null);
  };

  // Add or Edit Group
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editRecord) {
        // Update group
        await axiosInstance.post('/PermissionManagement/UpdateGroup', {
          GroupID: editRecord.key,
          GroupName: values.GroupName,
          Description: values.Description,
        });
        message.success('Group updated successfully.');
      } else {
        // Add group
        await axiosInstance.post('/PermissionManagement/CreateGroup', {
          GroupID: 0,
          GroupName: values.GroupName,
          Description: values.Description,
        });
        message.success('Group added successfully.');
      }
      fetchGroups(); // Refresh data
      handleCancel(); // Close modal
    } catch (error) {
      message.error('Error while saving the group.');
      console.error(error);
    }
  };

  // Delete a group
  const handleDelete = async (groupId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/PermissionManagement/DeleteGroup?groupId=${groupId}`);
      if (response.data.Status === 1) {
        message.success('Group deleted successfully.');
        fetchGroups(); // Refresh data
      } else {
        message.error('Failed to delete the group.');
      }
    } catch (error) {
      message.error('Error while deleting the group.');
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => setSearchName(e.target.value);
  const onSearch = (value) => setSearchName(value);

  const filteredData = dataSource.filter((item) =>
    item.hoTen.toLowerCase().includes(searchName.toLowerCase())
  );

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', align: 'center' },
    { title: 'Tên nhóm người dùng', dataIndex: 'hoTen', key: 'hoTen', align: 'left' },
    { title: 'Ghi chú', dataIndex: 'tenTaiKhoan', key: 'tenTaiKhoan', align: 'left' },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => setShowSettings(true)} // Open settings
           style={{ color: "black", fontSize: "20px" }}> 
            <SettingOutlined />
          </Button>
          <Button type="link" onClick={() => showModal(record)}
             style={{ color: "black", fontSize: "20px" }}>
        <EditOutlined />
      </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhóm này không?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger
             style={{ color: "black", fontSize: "20px" }}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleAddUser = () => {
    const newUser = { id: users.length + 1, name: "New User" }; // Replace with form input logic
    setUsers([...users, newUser]);
  };

  const permissionColumns = [
    { title: "Chức năng", dataIndex: "name", key: "name" },
    {
      title: "Xem",
      dataIndex: "xem",
      render: (_, record) => <Checkbox defaultChecked />,
    },
    {
      title: "Thêm",
      dataIndex: "them",
      render: (_, record) => <Checkbox defaultChecked />,
    },
    {
      title: "Sửa",
      dataIndex: "sua",
      render: (_, record) => <Checkbox defaultChecked />,
    },
    {
      title: "Xóa",
      dataIndex: "xoa",
      render: (_, record) => <Checkbox defaultChecked />,
    },
  ];

  const permissionData = permissions.map((item, index) => ({
    key: index,
    name: item.name,
    xem: true,
    them: true,
    sua: true,
    xoa: true,
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={contentStyle}>
        {!showSettings ? (
          <>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}
            >
              <h1 style={{ fontSize: 19 }}>QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG</h1>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                Thêm
              </Button>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <Search
                placeholder="Tìm kiếm theo tên"
                value={searchName}
                onSearch={onSearch}
                onChange={handleNameChange}
                style={{ width: 200 }}
              />
            </div>

            <Table
              className="custom-table"
              dataSource={filteredData}
              columns={columns}
              pagination={{ pageSize: 5 }}
              loading={loading}
            />
            <Modal
              title={editRecord ? 'Chỉnh sửa nhóm' : 'Thêm nhóm'}
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="Lưu"
              cancelText="Hủy"
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="GroupName"
                  label="Tên nhóm"
                  rules={[{ required: true, message: 'Vui lòng nhập tên nhóm!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Description"
                  label="Ghi chú"
                  rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </>
        ) : (
          <div style={{ marginBottom: '20px', width: '100%', height: '100%', color: '#000', backgroundColor: '#fff', borderRadius: 1, border: '1px solid #ccc', padding: '20px', position: 'relative' }} >
            <Button type="link" onClick={() => setShowSettings(false)} // Close settings
             style={{ color: "black", fontSize: "20px", position: 'absolute', top: '20px', right: '20px' }}>
              <CloseOutlined />
            </Button>
            <div>
              <h1 style={{ fontSize: 19 }}>QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG</h1>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '40%',height: '10px', border: '1px solid #d9d9d9', padding: '20px', borderRadius: '8px' }}>
                  <h3>Thêm người dùng</h3>
                  <List
                    dataSource={users}
                    renderItem={(item) => (
                      <List.Item actions={[<Button type="link" danger>X</Button>]}>
                        {item.name}
                      </List.Item>
                    )}
                  />
                  <Button type="primary" onClick={handleAddUser}>
                    Thêm người dùng
                  </Button>
                </div>
                <div style={{ width: '60%', border: '1px solid #d9d9d9', padding: '20px', borderRadius: '8px' }}>
                  <h3>Thêm chức năng</h3>
                  <div style={{ marginBottom: '10px' }}>
                    <Button type="primary">Thêm chức năng</Button>
                  </div>
                  <Table
                    columns={permissionColumns}
                    dataSource={permissionData}
                    pagination={false}
                    bordered
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Nguoidung;