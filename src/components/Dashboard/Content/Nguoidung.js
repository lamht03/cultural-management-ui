import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, Select, message, Spin, Modal, Form } from 'antd';
import { EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axiosInstance'; // Import axios
import '../../../assets/css/Nguoidung.css'; // File CSS for table styling
const { Content } = Layout;
const { Search } = Input;
const columns = (handleEdit, handleDelete, handleResetPassword) => [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    align: 'center',
    render: (_, __, index) => index + 1, // Show index + 1 for serial number
  },
  {
    title: 'Họ và tên',
    dataIndex: 'TenCanBo',
    key: 'TenCanBo',
    align: 'left',
  },
  {
    title: 'Tên tài khoản',
    dataIndex: 'TenNguoiDung',
    key: 'TenNguoiDung',
    align: 'left',
  },
  {
    title: 'Ngày sinh',
    dataIndex: 'NgaySinh',
    key: 'NgaySinh',
    align: 'left',
    render: (text) => new Date(text).toLocaleDateString(), // Format date
  },
  {
    title: 'Giới tính',
    dataIndex: 'GioiTinh',
    key: 'GioiTinh',
    align: 'left',
    render: (text) => (text === 1 ? 'Nam' : 'Nữ'), // Convert gender code to string
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'DiaChi',
    key: 'DiaChi',
    align: 'left',
  },
  {
    title: 'Cơ quan',
    dataIndex: 'TenCoQuan',
    key: 'TenCoQuan',
    align: 'left', // Placeholder for organization name
  },
  {
    title: 'Thao tác',
    key: 'actions',
    align: 'center',
    render: (_, record) => (
      <span>
        <Button type="link" style={{ color: 'black', fontSize: '20px' }} onClick={() => handleEdit(record)}>
          <EditOutlined />
        </Button>
        <Button type="link" danger style={{ color: 'black', fontSize: '20px' }} onClick={() => handleDelete(record.key)}>
          <DeleteOutlined />
        </Button>
        <Button type="link" danger style={{ color: 'black', fontSize: '20px' }} onClick={() => handleResetPassword(record.key)}>
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
  const [selectedCoQuanID, setSelectedCoQuanID] = useState(null);
  const [coQuanList, setCoQuanList] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null); 
  const handleResetPassword = async (userId) => {
    try {
      const response = await axiosInstance.post(`/v1/HeThongNguoiDung/DatLaiMatKhau?userId=${userId}`);
      if (response.data) {
        message.success('Mật khẩu đã được đặt lại thành công.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      message.error('Đã xảy ra lỗi khi đặt lại mật khẩu.');
    }
  };
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
    fetchCoQuan(); // Fetch organization data
  }, [searchName, selectedCoQuanID]); // Refetch data when searchName or selectedCoQuanID changes
  const fetchData = async () => {
    setLoading(true);
    try {
        // Gọi API với các tham số tìm kiếm
        const response = await axiosInstance.get(`/v1/HeThongCanBo/DanhSachCanBo`, {
            params: {
                TenCanBoOrTenNguoiDung: searchName, // Tên cán bộ hoặc tên người dùng
                CoQuanID: selectedCoQuanID, // ID của cơ quan đã chọn
                pageNumber: 1, // Số trang
                pageSize: 30 // Kích thước trang
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            const formattedData = response.data.data.map((item) => ({
                key: item.CanBoID,
                TenCanBo: item.TenCanBo,
                TenNguoiDung: item.TenNguoiDung,
                NgaySinh: item.NgaySinh,
                GioiTinh: item.GioiTinh,
                DiaChi: item.DiaChi,
                TenCoQuan: item.TenCoQuan,
                Email: item.Email,
                DienThoai: item.DienThoai,
                TrangThai: item.TrangThai,
            }));
            setData(formattedData);
        } else {
            setData([]);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Đã xảy ra lỗi khi lấy dữ liệu.');
    } finally {
        setLoading(false);
    }
};
  const flattenCoQuanData = (data) => {
    let result = [];
    const recurse = (items) => {
      items.forEach(item => {
        result.push({
          CoQuanID: item.CoQuanID,
          TenCoQuan: item.TenCoQuan,
        });
        if (item.children && item.children.length > 0) {
          recurse(item.children);
        }
      });
    };
    recurse(data);
    return result;
  };
  const fetchCoQuan = async () => {
    try {
      const response = await axiosInstance.get('/v1/DanhMucCoQuanDonVi/DanhSachCoQuan');
      if (response.data && Array.isArray(response.data.data)) {
        const flattenedData = flattenCoQuanData(response.data.data);
        setCoQuanList(flattenedData);
      } else {
        message.error('Không có dữ liệu cơ quan.');
      }
    } catch (error) {
      console.error('Error fetching cơ quan:', error);
      message.error('Đã xảy ra lỗi khi lấy danh sách cơ quan.');
    }
  };
  const postData = async (requestData) => {
    try {
      const response = await axiosInstance.post('/v1/HeThongCanBo/ThemMoiCanBo', requestData);
      if (response.data) {
        message.success('Dữ liệu đã được gửi thành công.');
        fetchData(); // Refresh the data after posting
        setIsModalVisible(false); // Close the modal
        form.resetFields(); // Reset the form fields
      }
    } catch (error) {
      console.error('Error posting data:', error);
      message.error('Đã xảy ra lỗi khi gửi dữ liệu.');
    }
  };
  const updateData = async (requestData) => {
    try {
      const response = await axiosInstance.post('/v1/HeThongCanBo/SuaThongTinCanBo', requestData);
      if (response.data) {
        message.success('Cập nhật dữ liệu thành công.');
        fetchData(); // Refresh the data after updating
        setIsModalVisible(false); // Close the modal
        form.resetFields(); // Reset the form fields
      }
    } catch (error) {
      console.error('Error updating data:', error);
      message.error('Đã xảy ra lỗi khi cập nhật dữ liệu.');
    }
  };
  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const requestData = {
          CanBoID: editingRecord ? editingRecord.key : 0, // Use existing ID for editing
          TenCanBo: values.TenCanBo,
          NgaySinh: values.NgaySinh,
          GioiTinh: values.GioiTinh,
          DiaChi: values.DiaChi,
          Email: values.Email,
          DienThoai: values.DienThoai,
          TrangThai: values.TrangThai,
          CoQuanID: values.CoQuanID,
          TenNguoiDung: values.TenNguoiDung,
          DanhSachNhomPhanQuyenID: [2]
        };
        if (editingRecord) {
          updateData(requestData); // Update existing record
        } else {
          postData(requestData); // Create new record
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  const handleEdit = (record) => {
    setEditingRecord(record); // Set the record to be edited
    form.setFieldsValue({
      key: record.key, // Set the key for the record being edited
      TenCanBo: record.TenCanBo,
      NgaySinh: record.NgaySinh,
      GioiTinh: record.GioiTinh,
      DiaChi: record.DiaChi,
      Email: record.Email,
      DienThoai: record.DienThoai,
      TrangThai: record.TrangThai,
      CoQuanID: record.CoQuanID,
      TenNguoiDung: record.TenNguoiDung,
      DanhSachNhomPhanQuyenID: [2], // Assuming this is a default value, adjust as necessary
    });
    setIsModalVisible(true); // Open the modal for editing
  };
  const handleDelete = (canBoId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa cán bộ này?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          const response = await axiosInstance.post(`/v1/HeThongCanBo/XoaThongTinCanBo?canBoId=${canBoId}`);
          if (response.data) {
            message.success('Cán bộ đã được xóa thành công.');
            fetchData(); // Refresh the data after deletion
          }
        } catch (error) {
          console.error('Error deleting data:', error);
          message.error('Đã xảy ra lỗi khi xóa dữ liệu.');
        }
      },
    });
  };
  return (
    <Content style={contentStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="text-2xl font-bold mb-6 text-center">QUẢN LÝ NGƯỜI DÙNG</h1>
        <Button type="primary" onClick={() => { setIsModalVisible(true); setEditingRecord(null); }}>Thêm</Button>
      </div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Select
          placeholder="Chọn cơ quan"
          allowClear
          onChange={setSelectedCoQuanID} // Update selectedCoQuanID on change
          style={{ width: 200 }}
        >
          {coQuanList.map((coQuan) => (
            <Select.Option key={coQuan.CoQuanID} value={coQuan.CoQuanID}>
              {coQuan.TenCoQuan}
            </Select.Option>
          ))}
        </Select>
        <Search
    placeholder="Nhập tên cán bộ hoặc cơ quan"
    allowClear
    value={searchName}
    onSearch={setSearchName}
    onChange={(e) => setSearchName(e.target.value)}
    style={{ width: 200 }}
/>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
      ) : (
        <Table
          className="custom-table"
          dataSource={data} // Dữ liệu sẽ được lấy từ state data
          columns={columns(handleEdit, handleDelete, handleResetPassword)} // Pass the edit and delete handlers to columns
          pagination={{ pageSize: 5 }}
        />
      )}
      <Modal
        title={editingRecord ? "Sửa người dùng" : "Thêm người dùng"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null); // Reset editing record
          form.resetFields(); // Reset the form fields
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="TenCanBo"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="NgaySinh"
            label="Ngày sinh"
            rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="GioiTinh"
            label="Giới tính"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value={1}>Nam</Select.Option>
              <Select.Option value={0}>Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="DiaChi"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="DienThoai"
            label="Điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={1}>Nghỉ hưu</Select.Option>
              <Select.Option value={3}>Đang Làm</Select.Option>
              <Select.Option value={2}>Chuyển công tác</Select.Option>
              <Select.Option value={4}>Nghỉ việc</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="nhom"
            label="Nhóm người dùng"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một nhóm người dùng!' }]}
          >
            <Select
              mode="multiple" // Enable multiple selection
              placeholder="Chọn nhóm người dùng"
            >
              <Select.Option value={1}>Cán bộ quản lý bảo tàng</Select.Option>
              <Select.Option value={3}>Văn hóa 02</Select.Option>
              <Select.Option value={2}>Văn hóa 1</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="CoQuanID"
            label="Cơ quan"
            rules={[{ required: true, message: 'Vui lòng chọn cơ quan!' }]}
          >
            <Select placeholder="Chọn cơ quan">
              {coQuanList.map((coQuan) => (
                <Select.Option key={coQuan.CoQuanID} value={coQuan.CoQuanID}>
                  {coQuan.TenCoQuan}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="TenNguoiDung"
            label="Tên tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};
export default Nguoidung;