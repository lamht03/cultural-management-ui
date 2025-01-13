import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axiosInstance';

const { Search } = Input;

const contentStyle = {
  width: '100%',
  textAlign: 'center',
  height: '800px',
  color: '#000',
  backgroundColor: '#fff',
  borderRadius: 4,
  border: '1px solid #ccc',
  padding: '20px',
};

const Content = () => {
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // To track the item being edited
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(false); // New state for editing

  // Fetch the data
  useEffect(() => {
    axiosInstance
      .get('/DanhMucDonViTinh/List?pageNumber=1&pageSize=20', {
        params: { pageNumber: 1, pageSize: 20 },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data);
          setFilteredData(response.data.data);
        } else {
          console.error('Expected data field with an array, but got:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        message.error('Không thể tải dữ liệu');
      });
  }, []);

  // Close the modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentItem(null); // Reset currentItem after closing
    setEditingRecord(false); // Reset editing state
    form.resetFields();
  };

  // Handle name search
  const handleNameChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchName(value);
    if (!value) {
      setFilteredData(data); // Reset to original data
    } else {
      setFilteredData(
        data.filter((item) =>
          item.TenDonViTinh.toLowerCase().includes(value)
        )
      );
    }
  };

  // Handle Add new item
  const handleAdd = () => {
    form.validateFields()
      .then((values) => {
        axiosInstance
          .post('/DanhMucDonViTinh/Insert', values)
          .then((response) => {
            if (response.data.status === 1) {
              message.success('Thêm mới thành công');
              fetchData(); // Refresh data
              handleCloseModal();
            } else {
              message.error(response.data.message || 'Thêm mới thất bại');
            }
          })
          .catch((error) => {
            console.error('Error adding item:', error);
            message.error('Có lỗi khi thêm');
          });
      })
      .catch((error) => {
        console.error('Form validation error:', error);
      });
  };

  // Handle Edit item
  const handleEdit = (item) => {
    setCurrentItem(item);
    setEditingRecord(true); // Set editing state to true when editing
    form.setFieldsValue({
      TenDonViTinh: item.TenDonViTinh,
      MaDonViTinh: item.MaDonViTinh,
      GhiChu: item.GhiChu,
    });
    setModalVisible(true);
  };

  // Handle Save Edit
  const handleSaveEdit = () => {
    form.validateFields()
      .then((values) => {
        axiosInstance
          .post('/DanhMucDonViTinh/Update', { DonViTinhID: currentItem.DonViTinhID, ...values })
          .then((response) => {
            if (response.data.status === 1) {
              message.success('Cập nhật thành công');
              fetchData(); // Refresh data
              handleCloseModal();
            } else {
              message.error(response.data.message || 'Cập nhật thất bại');
            }
          })
          .catch((error) => {
            console.error('Error updating item:', error);
            message.error('Có lỗi khi cập nhật');
          });
      })
      .catch((error) => {
        console.error('Form validation error:', error);
      });
  };

  // Handle Delete item
  const handleDelete = (item) => {
    // Hiển thị modal xác nhận
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      content: `Bạn đang muốn xóa đơn vị tính: ${item.TenDonViTinh}`,
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        // Nếu người dùng chọn "Có", thực hiện xóa
        axiosInstance
          .post(`/DanhMucDonViTinh/Delete?id=${item.DonViTinhID}`)
          .then((response) => {
            if (response.data.status === 1) {
              message.success('Xóa thành công');
              fetchData(); // Refresh data
            } else {
              message.error(response.data.message || 'Xóa thất bại');
            }
          })
          .catch((error) => {
            console.error('Error deleting item:', error);
            message.error('Có lỗi khi xóa');
          });
      },
      onCancel: () => {
        // Nếu người dùng chọn "Không", không làm gì
        console.log('Xóa bị hủy');
      }
    });
  };

  // Fetch data
  const fetchData = () => {
    axiosInstance
      .get('/DanhMucDonViTinh/List?pageNumber=1&pageSize=20', {
        params: { pageNumber: 1, pageSize: 20 },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data);
          setFilteredData(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        message.error('Không thể tải dữ liệu');
      });
  };

  const columns = (onEdit, onDelete) => [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên đơn vị tính',
      dataIndex: 'TenDonViTinh',
      key: 'TenDonViTinh',
      align: 'left',
    },
    {
      title: 'Mã đơn vị tính',
      dataIndex: 'MaDonViTinh',
      key: 'MaDonViTinh',
      align: 'left',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      align: 'left',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <span className="action-icons">
          <Button
            type="link"
            style={{ color: 'black', fontSize: '20px' }}
            onClick={() => onEdit(record)}
          >
            <EditOutlined />
          </Button>
          <Button
            type="link"
            style={{ color: 'black', fontSize: '20px' }}
            danger
            onClick={() => onDelete(record)}
          >
            <DeleteOutlined />
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div style={contentStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ fontSize: 19, marginRight: 10 }}>DANH MỤC ĐƠN VỊ TÍNH</h1>
        <Button type="primary" onClick={() => setModalVisible(true)}>Thêm mới</Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Search
          placeholder="Tìm kiếm theo tên đơn vị tính"
          value={searchName}
          onChange={handleNameChange}
          onSearch={() => {
            if (!searchName) {
              setFilteredData(data); // Reset to original data
            }
          }}
          allowClear
          style={{ width: 200, marginRight: 10 }}
        />
      </div>
      <Table
        className="custom-table"
        columns={columns(handleEdit, handleDelete)}
        dataSource={filteredData}
        pagination={{
          pageSize: 5,
          onChange: (page, pageSize) =>
            console.log('Page:', page, 'PageSize:', pageSize),
        }}
        rowClassName="editable-row"
      />
      <Modal
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={editingRecord ? handleSaveEdit : handleAdd}
          >
            {editingRecord ? 'Cập nhật' : 'Thêm mới'}
          </Button>,
        ]}
        title={editingRecord ? 'Cập nhật đơn vị tính' : 'Thêm mới đơn vị tính'}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingRecord ? handleSaveEdit : handleAdd}
        >
          <Form.Item
            label="Tên đơn vị tính"
            name="TenDonViTinh"
            rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị tính' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã đơn vị tính"
            name="MaDonViTinh"
            rules={[{ required: true, message: 'Vui lòng nhập mã đơn vị tính' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Ghi chú" name="GhiChu">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Content;
