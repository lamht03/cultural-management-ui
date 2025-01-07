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
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  useEffect(() => {
    axiosInstance
      .get('/DanhMucDonViTinh/List?pageNumber=1&pageSize=20', {
        params: { pageNumber: 1, pageSize: 20 },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
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

  const handleOpenModal = (record = null) => {
    if (record) {
      setIsEditing(true);
      setCurrentRecord(record);
      form.setFieldsValue({
        TenDonViTinh: record.TenDonViTinh,
        MaDonViTinh: record.MaDonViTinh,
        GhiChu: record.GhiChu,
      });
    } else {
      setIsEditing(false);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      content: `Bạn đang xóa đơn vị tính: ${record.TenDonViTinh}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        axiosInstance
          .post(`/DanhMucDonViTinh/Delete`, null, {
            params: { id: record.DonViTinhID },
          })
          .then((response) => {
            if (response.data.status === 1) {
              setFilteredData((prev) => prev.filter((item) => item.DonViTinhID !== record.DonViTinhID));
              message.success('Đơn vị tính đã được xóa thành công');
            } else {
              message.error(`Xóa thất bại: ${response.data.message}`);
            }
          })
          .catch((error) => {
            console.error('Error deleting data:', error);
            message.error('Có lỗi xảy ra khi xóa.');
          });
      },
    });
  };

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

  const handleFormSubmit = (values) => {
    if (isEditing) {
      axiosInstance
        .post('/DanhMucDonViTinh/Update', {
          DonViTinhID: currentRecord.DonViTinhID,
          TenDonViTinh: values.TenDonViTinh,
          MaDonViTinh: values.MaDonViTinh,
          GhiChu: values.GhiChu,
        })
        .then((response) => {
          if (response.data.status === 1) {
            const updatedData = filteredData.map((item) =>
              item.DonViTinhID === currentRecord.DonViTinhID ? { ...item, ...values } : item
            );
            setFilteredData(updatedData);
            handleCloseModal();
            message.success('Cập nhật đơn vị tính thành công');
          } else {
            message.error(`Cập nhật thất bại: ${response.data.message}`);
          }
        })
        .catch((error) => {
          console.error('Error updating data:', error);
          message.error('Có lỗi xảy ra khi cập nhật.');
        });
    } else {
      axiosInstance
        .post('/DanhMucDonViTinh/Insert', {
          TenDonViTinh: values.TenDonViTinh,
          MaDonViTinh: values.MaDonViTinh,
          GhiChu: values.GhiChu,
        })
        .then((response) => {
          if (response.data.status === 1) {
            const newRecord = {
              DonViTinhID: Date.now(),
              ...values,
            };
            setFilteredData([...filteredData, newRecord]);
            handleCloseModal();
            message.success('Thêm mới đơn vị tính thành công');
          } else {
            message.error(`Thêm mới thất bại: ${response.data.message}`);
          }
        })
        .catch((error) => {
          console.error('Error adding data:', error);
          message.error('Có lỗi xảy ra khi thêm mới.');
        });
    }
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
        <Button type="primary" onClick={() => handleOpenModal()}>
          Thêm mới
        </Button>
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
  allowClear // Enables the clear button
  style={{ width: 200, marginRight: 10 }}
/>
      </div>
      <Table
        className="custom-table"
        columns={columns(handleOpenModal, handleDelete)}
        dataSource={filteredData}
        pagination={{
          pageSize: 5,
          onChange: (page, pageSize) =>
            console.log('Page:', page, 'PageSize:', pageSize),
        }}
        rowClassName="editable-row"
      />
      <Modal
        title={isEditing ? 'Sửa đơn vị tính' : 'Thêm mới đơn vị tính'}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            label="Tên đơn vị tính"
            name="TenDonViTinh"
            rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị tính' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã đơn vị tính"
            name="MaDonViTinh"
            rules={[{ required: true, message: 'Vui lòng nhập mã đơn vị tính' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Ghi chú" name="GhiChu">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Content;
