import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, message, Popconfirm, Modal, Form, Checkbox, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axiosInstance';
import '../../../assets/css/Nguoidung.css';
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const contentStyle = {
  width: '100%',
  height: '100%',
  color: '#000',
  backgroundColor: '#f9f9f9',
  borderRadius: 1,
  border: '1px solid #ccc',
  padding: '20px',
};
const Nguoidung = () => {
  const [searchName, setSearchName] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isAddFunctionModalVisible, setIsAddFunctionModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  // Fetch data from API
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/v1/PhanQuyen/DanhSachNhomPhanQuyen?pageNumber=1&pageSize=20', {
        params: { pageNumber: 1, pageSize: 20 },
      });
      if (response.data.Status === 1) {
        const formattedData = response.data.Data.map((item, index) => ({
          key: item.NhomPhanQuyenID,
          stt: index + 1,
          hoTen: item.TenNhomPhanQuyen,
          tenTaiKhoan: item.MoTa,
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

  // Open modal for adding user to group
  const showAddUserModal = () => {
    setIsAddUserModalVisible(true);
  };

  // Open modal for adding function to group
  const showAddFunctionModal = () => {
    setIsAddFunctionModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditRecord(null);
  };

  // Close add user modal
  const handleAddUserCancel = () => {
    setIsAddUserModalVisible(false);
  };

  // Close add function modal
  const handleAddFunctionCancel = () => {
    setIsAddFunctionModalVisible(false);
  };

  // Add or Edit Group
  const handleOk = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();
      
      if (editRecord) {
        // Update group
        const payload = {
          NhomPhanQuyenID: editRecord.key, // Existing group ID
          TenNhomPhanQuyen: values.GroupName, // Group name
          MoTa: values.Description, // Description
        };
        
        await axiosInstance.post('/v1/PhanQuyen/CapNhatNhomPhanQuyen', payload);
        message.success('Group updated successfully.');
      } else {
        // Add group
        const payload = {
          TenNhomPhanQuyen: values.GroupName, // Group name
          MoTa: values.Description, // Description
        };
        
        await axiosInstance.post('/v1/PhanQuyen/ThemMoiNhomPhanQuyen', payload);
        message.success('Group added successfully.');
      }
      
      fetchGroups(); // Refresh group data
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
      const response = await axiosInstance.post(`/v1/PhanQuyen/XoaNhomPhanQuyen?NhomPhanQuyenID=${groupId}`);
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
          <>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}
            >
              <h1 style={{ fontSize: 19 }}>QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG</h1>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                Thêm
              </Button>
            </div>
            <div style={{ marginBottom: '20px', width: '100%', height: '100%', color: '#000', backgroundColor: '#fff', borderRadius: 1, border: '1px solid #ccc', padding: '20px', position: 'relative' }}>
              <Button type="link" onClick={() => setShowSettings(false)} style={{ color: "black", fontSize: "20px", position: 'absolute', top: '10px', right: '10px' }}>
                <CloseOutlined />
              </Button>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <Search
                  placeholder="Tìm kiếm theo tên"
                  value={searchName}
                  onSearch={onSearch}
                  onChange={handleNameChange}
                  style={{ width: 200 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', backgroundColor: '#fff', color: '#000', marginTop: '20px', width: '100%', height: '300px', borderRadius: 1, border: '1px solid #ccc', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f0f0f0', color: '#000', width: '100%', height: '100%', borderRadius: 1, border: '1px solid #ccc', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 11, marginTop: '-26px' }}>Thêm người dùng</h3>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showAddUserModal}>
                      Thêm
                    </Button>
                  </div>
                  <span style={{ marginTop: '10px' }}>
                    <CloseOutlined style={{ marginRight: '5px' }} />
                    tranviethung (Trần Việt Hưng - Sở Văn Hóa và Thể Thao)
                  </span>
                </div>
                {/* Hàng thứ hai */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#e0e0e0', color: '#000', width: '100%', height: '100%', borderRadius: 1, border: '1px solid #ccc', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 11, marginTop: '-26px' }}>Thêm chức năng cho nhóm</h3>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showAddFunctionModal}>
                      Thêm
                    </Button>
                  </div>
                  <b style={{ marginTop: '10px', alignSelf: 'flex-start' }}>Hệ Thống</b>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <ul style={{ flex: 1 }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginLeft: '-40px' }}>
                        <span>Quản lý người dùng</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <Checkbox>Xem</Checkbox>
                          <Checkbox>Thêm</Checkbox>
                          <Checkbox>Sửa</Checkbox>
                          <Checkbox>Xóa</Checkbox>
                          <CloseOutlined />
                        </div>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginLeft: '-40px' }}>
                        <span>Quản lý nhóm</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <Checkbox>Xem</Checkbox>
                          <Checkbox>Thêm</Checkbox>
                          <Checkbox>Sửa</Checkbox>
                          <Checkbox>Xóa</Checkbox>
                          <CloseOutlined />
                        </div>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginLeft: '-40px' }}>
                        <span>Quản lý phân quyền</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <Checkbox>Xem</Checkbox>
                          <Checkbox>Thêm</Checkbox>
                          <Checkbox>Sửa</Checkbox>
                          <Checkbox>Xóa</Checkbox>
                          <CloseOutlined />
                        </div>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginLeft: '-40px' }}>
                        <span>Quản lý báo cáo</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <Checkbox>Xem</Checkbox>
                          <Checkbox>Thêm</Checkbox>
                          <Checkbox>Sửa</Checkbox>
                          <Checkbox>Xóa</Checkbox>
                          <CloseOutlined />
                        </div>
                      </li>
                    </ul>
                  </div>
                  <Modal
              title="Thêm chức năng cho nhóm"
              visible={isAddFunctionModalVisible}
              onOk={handleAddFunctionCancel}
              onCancel={handleAddFunctionCancel}
              okText="Lưu"
              cancelText="Hủy"
            >
              <Form layout="vertical">
                <Form.Item label="Chọn chức năng">
                  <Select placeholder="Chọn chức năng">
                    <Option value="chucnang1">Chức năng 1</Option>
                    <Option value="chucnang2">Chức năng 2</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="Thêm người dùng vào nhóm"
              visible={isAddUserModalVisible}
              onOk={handleAddUserCancel}
              onCancel={handleAddUserCancel}
              okText="Lưu"
              cancelText="Hủy"
            >
              <Form layout="vertical">
                <Form.Item label="Chọn cơ quan">
                  <Select placeholder="Chọn cơ quan">
                    <Option value="coquan1">Cơ quan 1</Option>
                    <Option value="coquan2">Cơ quan 2</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Chọn người dùng">
                  <Select placeholder="Chọn người dùng">
                    <Option value="user1">Người dùng 1</Option>
                    <Option value="user2">Người dùng 2</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
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
                  name="TenNhomPhanQuyen"
                  label="Tên nhóm"
                  rules={[{ required: true, message: 'Vui lòng nhập tên nhóm!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="MoTa"
                  label="Ghi chú"
                  rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
                </div>
              </div>
            </div>
            <Table
              className="custom-table"
              dataSource={filteredData}
              columns={columns}
              pagination={{ pageSize: 5 }}
              loading={loading}
            />
          </>
        )}
      </Content>
    </Layout>
  );
};
export default Nguoidung;