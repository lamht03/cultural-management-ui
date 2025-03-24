import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, message, Popconfirm, Modal, Form, Checkbox, Select } from 'antd';
import { SaveOutlined } from "@ant-design/icons";
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
    // Dùng để quản lý form "Thêm chức năng"
  const [functionForm] = Form.useForm();

  // Danh sách chức năng mà API trả về (khi ấn nút Thêm)
  const [functionList, setFunctionList] = useState([]);
  // Lưu trữ các quyền checkbox
// Ban đầu đặt giá trị false (false = không có quyền, true = có quyền)
const [rightXem, setRightXem] = useState(false);
const [rightThem, setRightThem] = useState(false);
const [rightSua, setRightSua] = useState(false);
const [rightXoa, setRightXoa] = useState(false);
  const [nhomPhanQuyenID, setNhomPhanQuyenID] = useState(null);
  const [usersData1, setUsersData1] = useState([]);
  const [showUserList, setShowUserList] = useState(true);
  const [addedUsers, setAddedUsers] = useState([]); // State to 
  const [usersData, setUsersData] = useState([]);
  const [permissionsData, setPermissionsData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isAddFunctionModalVisible, setIsAddFunctionModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userForm] = Form.useForm(); // Form for adding user
  const handleAddUserCancel = () => {
    setIsAddUserModalVisible(false);
    userForm.resetFields(); // Reset the form fields when closing the modal
    setShowUserList(true); // Show the user list again when modal is closed
  };
  // 
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/v1/HeThongCanBo/DanhSachCanBo?pageNumber=1&pageSize=30');
      if (response.data) { // Check if data exists
        setUsersData1(response.data.data); // Set users data
      } else {
        message.error('Failed to fetch users data.');
      }
    } catch (error) {
      message.error('Error while fetching users data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch data from API
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/v1/HeThongPhanQuyen/DanhSachNhomPhanQuyen?pageNumber=1&pageSize=20', {
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

  const showAddFunctionModal = async () => {
    try {
      // Gọi API lấy danh sách tất cả chức năng
      const res = await axiosInstance.get('/v1/HeThongPhanQuyen/DanhSachChucNang');
      if (res.data.Status === 1) {
        setFunctionList(res.data.Data); // Lưu danh sách chức năng
      } else {
        message.error('Không lấy được danh sách chức năng');
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi lấy danh sách chức năng');
    }
    
    // Reset quyền
    setRightXem(0);
    setRightThem(0);
    setRightSua(0);
    setRightXoa(0);
    
    // Hiển thị modal
    setIsAddFunctionModalVisible(true);
  };
  
  // Handle adding a user to a group
  const handleAddUser  = async () => {
    try {
      const values = await userForm.validateFields();
  
      // Sử dụng nhomPhanQuyenID từ state
      const payload = {
        NguoiDungID: values.NguoiDungID,
        NhomPhanQuyenID: nhomPhanQuyenID, // Sử dụng giá trị từ state
      };
  
      const response = await axiosInstance.post('/v1/HeThongPhanQuyen/ThemNguoiDungVaoNhomPhanQuyen', payload);
      if (response.data.status === 1) {
        message.success('User  added to group successfully.');
        window.location.reload();
        const addedUser  = usersData.find(user => user.NguoiDungID === values.NguoiDungID);
        if (addedUser ) {
          setAddedUsers(prev => [...prev, addedUser ]);
        }
        setIsAddUserModalVisible(false);
        userForm.resetFields();
      } else {
        message.error('Failed to add user to group.');
      }
    } catch (error) {
      message.error('Error while adding the user to the group.');
      console.error(error);
    }
  };
  // Open modal for adding user to group
  const showAddUserModal = () => {
    fetchUsers(); // Fetch users when opening the modal
    setIsAddUserModalVisible(true);
  };
  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditRecord(null);
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
        await axiosInstance.post('/v1/HeThongPhanQuyen/CapNhatNhomPhanQuyen', payload);
        message.success('Group updated successfully.');
      } else {
        // Add group
        const payload = {
          TenNhomPhanQuyen: values.GroupName, // Group name
          MoTa: values.Description, // Description
        };
        await axiosInstance.post('/v1/HeThongPhanQuyen/ThemMoiNhomPhanQuyen', payload);
        message.success('Group added successfully.');
      }
      fetchGroups(); // Refresh group data
      handleCancel(); // Close modal
    } catch (error) {
      message.error('Tên chức năng đã tồn tại !');
      console.error(error);
    }
  };
  // Delete a group
  const handleDelete = async (groupId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/v1/HeThongPhanQuyen/XoaNhomPhanQuyen?NhomPhanQuyenID=${groupId}`);
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
  const handleDeleteUser = async (nguoiDungID, nhomPhanQuyenID) => {
    setLoading(true);
    try {
      const payload = {
        NguoiDungID: nguoiDungID,
        NhomPhanQuyenID: nhomPhanQuyenID,
      };
      
      const response = await axiosInstance.post('/v1/HeThongPhanQuyen/XoaNguoiDungKhoiNhomPhanQuyen', payload);
      if (response.data.status === 1) {
        message.success('User deleted successfully.');
        window.location.reload();
      } else {
        message.error('Failed to delete the user.');
      }
    } catch (error) {
      message.error('Error while deleting the user.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleNameChange = (e) => setSearchName(e.target.value);
  const onSearch = (value) => setSearchName(value);
  const filteredData = dataSource.filter((item) =>
    item.hoTen.toLowerCase().includes(searchName.toLowerCase())
  );
  const handleSettingsClick = async (record) => {
    setLoading(true);
    const nhomPhanQuyenID = record.key; // Lấy ID từ record
    setNhomPhanQuyenID(nhomPhanQuyenID); // Lưu trữ ID vào state
  
    try {
      const [usersResponse, permissionsResponse] = await Promise.all([
        axiosInstance.get(`/v1/HeThongPhanQuyen/LayDanhSachNguoiDungTrongNhomPhanQuyenTheoNhomPhanQuyenID?nhomPhanQuyenID=${nhomPhanQuyenID}`),
        axiosInstance.get(`/v1/HeThongPhanQuyen/LayDanhSachChucNangTrongNhomPhanQuyenTheoNhomPhanQuyenID?nhomPhanQuyenID=${nhomPhanQuyenID}`)
      ]);
  
      if (usersResponse.data.status === 1) {
        setUsersData(usersResponse.data.data);
      } else {
        message.error('Failed to fetch users data.');
      }
  
      if (permissionsResponse.data.status === 1) {
        setPermissionsData(permissionsResponse.data.data);
      } else {
        message.error('Failed to fetch permissions data.');
      }
  
      setShowSettings(true);
    } catch (error) {
      message.error('Error while fetching data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          <Button type="link" onClick={() => handleSettingsClick(record)} style={{ color: "black", fontSize: "20px" }}>
            <SettingOutlined />
          </Button>
          <Button type="link" onClick={() => showModal(record)} style={{ color: "black", fontSize: "20px" }}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhóm này không?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger style={{ color: "black", fontSize: "20px" }}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];
  const handleAddFunction = async () => {
    try {
      const values = await functionForm.validateFields();
      if (!nhomPhanQuyenID) {
        message.error('Chưa chọn nhóm phân quyền!');
        return;
      }
  
      // Ensure all permissions are included in the payload
      const payload = {
        NhomPhanQuyenID: nhomPhanQuyenID,
        ChucNangID: values.ChucNangID,
        Xem: rightXem || false,
        Them: rightThem || false,
        Sua: rightSua || false,
        Xoa: rightXoa || false,
      };
  
      const response = await axiosInstance.post('/v1/HeThongPhanQuyen/ThemChucNangVaoNhomPhanQuyen', payload);
      if (response.data.status === 1) {
        message.success('Thêm chức năng thành công!');
        const updatedPermissions = await axiosInstance.get(`/v1/HeThongPhanQuyen/LayDanhSachChucNangTrongNhomPhanQuyenTheoNhomPhanQuyenID?nhomPhanQuyenID=${nhomPhanQuyenID}`);
        if (updatedPermissions.data.status === 1) {
          setPermissionsData(updatedPermissions.data.data);
        }
      } else {
        message.error('Không thể thêm chức năng vào nhóm');
      }
    } catch (error) {
      console.error('Error adding function:', error);
      message.error('Lỗi khi thêm chức năng vào nhóm');
    } finally {
      setIsAddFunctionModalVisible(false);
      functionForm.resetFields();
    }
  };

  // Xóa chức năng khỏi nhóm
const handleDeletePermission = async (chucNangID, nhomPhanQuyenID) => {
  setLoading(true);
  try {
    // Payload gửi lên API
    const payload = {
      ChucNangID: chucNangID,
      NhomPhanQuyenID: nhomPhanQuyenID
    };
    
    // Gọi API xóa
    const response = await axiosInstance.post('/v1/HeThongPhanQuyen/XoaChucNangKhoiNhomPhanQuyen', payload);
    if (response.data.status === 1) {
      message.success('Chức năng đã được xóa khỏi nhóm!');
      
      // Làm mới danh sách permissions
      const updatedPermissions = await axiosInstance.get(`/v1/HeThongPhanQuyen/LayDanhSachChucNangTrongNhomPhanQuyenTheoNhomPhanQuyenID?nhomPhanQuyenID=${nhomPhanQuyenID}`);
      if (updatedPermissions.data.status === 1) {
        setPermissionsData(updatedPermissions.data.data);
      }
  } else {
      message.error('Xóa chức năng không thành công!');
    }
  } catch (error) {
    message.error('Error while removing the permission.');
    console.error('Delete permission error:', error);
  } finally {
    setLoading(false);
  }
};

const handleCheckboxChange = (chucNangID, permissionType) => {
  setPermissionsData(prevPermissions =>
    prevPermissions.map(permission =>
      permission.ChucNangID === chucNangID
        ? { ...permission, [permissionType]: !permission[permissionType] }
        : permission
    )
  );
};

const handleSavePermissions = async () => {
  try {
    const response = await axiosInstance.post('/v1/HeThongPhanQuyen/CapNhatQuyenNhomChucNang', permissionsData);
    if (response.data.status === 1) {
      message.success('Permissions updated successfully!');
    } else {
      message.error('Failed to update permissions.');
    }
  } catch (error) {
    message.error('Error while updating permissions.');
    console.error(error);
  }
};

      return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={contentStyle}>
        {!showSettings ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 className="text-2xl font-bold mb-6 text-center">QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG</h1>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 className="text-2xl font-bold mb-6 text-center">QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG</h1>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                Thêm
              </Button>
            </div>
            <div style={{ marginBottom: '20px', width: '100%', height: '100%', color: '#000', backgroundColor: '#fff', borderRadius: 1, border: '1px solid #ccc', padding: '20px', position: 'relative' }}>
              <Button type="link" onClick={() => setShowSettings(false)} style={{ color: "black", fontSize: "20px", position: 'absolute', top: '10px', right: '10px' }}>
                <CloseOutlined />
              </Button>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <Select placeholder="Tìm kiếm theo tên" value={searchName} style={{ width: 200 }}>
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                </Select>
                <Search
                  placeholder="Tìm kiếm theo tên"
                  value={searchName}
                  onSearch={onSearch}
                  onChange={handleNameChange}
                  style={{ width: 200 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', backgroundColor: '#fff', color: '#000', marginTop: '20px', width: '100%', height: '300px', borderRadius: 1, border: '1px solid #ccc', padding: '20px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f0f0f0', color: '#000', width: '100%', height: '100%', borderRadius: 1, border: '1px solid #ccc', padding: '20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-2xl font-bold mb-6 text-center" style={{ fontSize: '20px' }}>Thêm người dùng</h3>
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddUserModal}>
                Thêm
            </Button>
        </div>
        {/* Render user data here */}
        {showUserList && (
            <div style={{ marginTop: '10px' }}>
                {usersData.length > 0 ? (
                    usersData.map(user => (
                        <span key={user.NguoiDungID} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                            <span style={{ marginRight: '5px' }}>{user.TenNguoiDung}</span>
                            <Popconfirm
                                title={`Bạn có chắc muốn xóa ${user.TenNguoiDung} không?`}
                                onConfirm={() => handleDeleteUser(user.NguoiDungID, user.NhomPhanQuyenID)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <CloseOutlined style={{ cursor: 'pointer', color: 'red' }} />
                            </Popconfirm>
                        </span>
                    ))
                ) : (
                    <span>Không có người dùng nào.</span>
                )}
            </div>
        )}
    </div>
    {/* Hàng thứ hai */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#e0e0e0', color: '#000', width: '100%', height: '100%', borderRadius: 1, border: '1px solid #ccc', padding: '20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-2xl font-bold mb-6 text-center" style={{ fontSize: '20px' }}>Thêm chức năng cho nhóm</h3>
            <div>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddFunctionModal}>
                    Thêm
                </Button>
                <Button 
                    type="primary" 
                    onClick={handleSavePermissions} 
                    style={{ marginLeft: '10px' }}
                    icon={<SaveOutlined />}
                >
                    Lưu
                </Button>
            </div>
        </div>
        <b style={{ marginTop: '10px', alignSelf: 'flex-start' }}>Hệ Thống</b>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <ul style={{ flex: 1, marginLeft: '40px' }}>
                {permissionsData.map(permission => (
                    <li key={permission.ChucNangID} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{permission.TenChucNang}</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Checkbox
                                checked={permission.Xem}
                                onChange={() => handleCheckboxChange(permission.ChucNangID, 'Xem')}
                            >
                                Xem
                            </Checkbox>
                            <Checkbox
                                checked={permission.Them}
                                onChange={() => handleCheckboxChange(permission.ChucNangID, 'Them')}
                            >
                                Thêm
                            </Checkbox>
                            <Checkbox
                                checked={permission.Sua}
                                onChange={() => handleCheckboxChange(permission.ChucNangID, 'Sua')}
                            >
                                Sửa
                            </Checkbox>
                            <Checkbox
                                checked={permission.Xoa}
                                onChange={() => handleCheckboxChange(permission.ChucNangID, 'Xoa')}
                            >
                                Xóa
                            </Checkbox>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
</div>
            </div>
          </>
        )}
 <Modal
  title="Thêm người dùng"
  visible={isAddUserModalVisible}
  onCancel={handleAddUserCancel}
  footer={[
    <Button key="cancel" onClick={handleAddUserCancel}>
      Hủy
    </Button>,
    <Button key="submit" type="primary" onClick={handleAddUser}>
      Lưu
    </Button>,
  ]}
>
  <Form form={userForm} layout="vertical">
    <Form.Item
      name="NguoiDungID"
      label="Thêm người dùng"
      rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
    >
      <Select placeholder="Chọn người dùng" loading={loading}>
        {usersData1.map(user => (
          <Option key={user.NguoiDungID} value={user.NguoiDungID}>
            {user.TenNguoiDung}
          </Option>
        ))}
      </Select>
    </Form.Item>
  </Form>
</Modal>
<Modal
  title="Thêm chức năng cho nhóm"
  visible={isAddFunctionModalVisible}
  onCancel={() => setIsAddFunctionModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsAddFunctionModalVisible(false)}>
      Hủy
    </Button>,
    <Button key="submit" type="primary" onClick={handleAddFunction}>
      Lưu
    </Button>,
  ]}
>
  <Form form={functionForm} layout="vertical">
    <Form.Item
      name="ChucNangID"
      label="Chọn chức năng"
      rules={[{ required: true, message: 'Vui lòng chọn chức năng!' }]}
    >
      <Select placeholder="Chọn chức năng" style={{ width: '100%' }}>
        {functionList.map((func) => (
          <Option key={func.ChucNangID} value={func.ChucNangID}>
            {func.TenChucNang}
          </Option>
        ))}
      </Select>
    </Form.Item>
    <div style={{ marginTop: '10px' }}>
      <label>Chọn quyền:</label>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Checkbox
          checked={rightXem}
          onChange={() => setRightXem(!rightXem)}
        >
          Xem
        </Checkbox>
        <Checkbox
          checked={rightThem}
          onChange={() => setRightThem(!rightThem)}
        >
          Thêm
        </Checkbox>
        <Checkbox
          checked={rightSua}
          onChange={() => setRightSua(!rightSua)}
        >
          Sửa
        </Checkbox>
        <Checkbox
          checked={rightXoa}
          onChange={() => setRightXoa(!rightXoa)}
        >
          Xóa
        </Checkbox>
      </div>
    </div>
  </Form>
</Modal>

      </Content>
    </Layout>
  );
};
export default Nguoidung;