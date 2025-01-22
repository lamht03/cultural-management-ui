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
  const [currentItem, setCurrentItem] = useState(null);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch the data
  const fetchData = () => {
    setLoading(true); // Set loading to true
    axiosInstance
      .get('/v1/DanhMucDonViTinh/DanhSachDonViTinh?pageNumber=1&pageSize=20')
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
      })
      .finally(() => {
        setLoading(false); // Set loading to false
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentItem(null);
    setEditingRecord(false);
    form.resetFields();
  };

  const handleNameChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchName(value);
    if (!value) {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((item) =>
          item.TenDonViTinh.toLowerCase().includes(value)
        )
      );
    }
  };

  const handleAdd = () => {
    form.validateFields()
      .then((values) => {
        setLoading(true); // Set loading to true
        axiosInstance
          .post('/v1/DanhMucDonViTinh/ThemMoiDonViTinh', values)
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
          })
          .finally(() => {
            setLoading(false); // Set loading to false
          });
      })
      .catch((error) => {
        console.error('Form validation error:', error);
      });
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setEditingRecord(true);
    form.setFieldsValue({
      TenDonViTinh: item.TenDonViTinh,
      MaDonViTinh: item.MaDonViTinh,
      GhiChu: item.GhiChu,
    });
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    form.validateFields()
      .then((values) => {
        setLoading(true); // Set loading to true
        axiosInstance
          .post('/v1/DanhMucDonViTinh/CapNhatDonViTinh', { DonViTinhID: currentItem.DonViTinhID, ...values })
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
          })
          .finally(() => {
            setLoading(false); // Set loading to false
          });
      })
      .catch((error) => {
        console.error('Form validation error:', error);
      });
  };

  const handleDelete = (item) => {
    if (!item || !item.DonViTinhID) {
      message.error('Thông tin đơn vị tính không hợp lệ');
      return;
    }

    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      content: `Bạn đang muốn xóa đơn vị tính: ${item.TenDonViTinh}`,
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        setLoading(true); // Set loading to true
        const hideLoading = message.loading('Đang xóa...', 0);
        axiosInstance
          .post(`/v1/DanhMucDonViTinh/XoaDonViTinh?id=${item.DonViTinhID}`)
          .then((response) => {
            hideLoading();
            if (response.data.status === 1) {
              message.success('Xóa thành công');
              fetchData(); // Refresh data
            } else {
              message.error(response.data.message || 'Xóa thất bại');
            }
          })
          .catch((error) => {
            hideLoading();
            console.error('Error deleting item:', error);
            message.error('Có lỗi xảy ra khi xóa đơn vị tính');
          })
          .finally(() => {
            setLoading(false); // Set loading to false
          });
      },
      onCancel: () => {
        console.log('Xóa bị hủy');
      }
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
        loading={loading} // Show loading state
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
            onClick={editingRecord ? handleSaveEdit : handleAdd}
            loading={loading} // Show loading state for the button
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