import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, Modal, Form, message} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axiosInstance';
import '../../../assets/css/Nguoidung.css';

const { Content } = Layout;
const { Search } = Input;

const Nguoidung = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/DanhMucLoaiDiTich/List?pageNumber=1&pageSize=20');
      if (response.data.status === 1) {
        const fetchedData = response.data.data.map((item, index) => ({
          key: item.LoaiDiTichID,
          stt: index + 1,
          TenLoaiDiTich: item.TenLoaiDiTich,
          GhiChu: item.GhiChu,
        }));
        setDataSource(fetchedData);
      } else {
        message.error('Không thể tải dữ liệu.');
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu từ API.');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => setSearchName(e.target.value);

  const handleAddNew = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        // Update record
        const response = await axiosInstance.post(
          `/DanhMucLoaiDiTich/Update`,
          { ...values, LoaiDiTichID: editingRecord.key }
        );
        if (response.data.status === 1) {
          message.success('Cập nhật loại di tích thành công!');
        } else {
          message.error('Cập nhật loại di tích thất bại.');
        }
      } else {
        // Add new record
        const response = await axiosInstance.post(
          '/DanhMucLoaiDiTich/Insert',
          values
        );
        if (response.data.status === 1) {
          message.success('Thêm loại di tích thành công!');
        } else {
          message.error('Thêm loại di tích thất bại.');
        }
      }
      fetchData();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi xử lý yêu cầu.');
    }
  };
  const onEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      TenLoaiDiTich: record.TenLoaiDiTich,
      GhiChu: record.GhiChu,
    });
    setIsModalOpen(true);
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Xóa Dữ Liệu',
      content: 'Bạn có chắc chắn muốn xóa dữ liệu này không?',
      okText: 'Có',
      cancelText: 'Không',
      okType: 'primary',
      onOk: async () => {
        try {
          const response = await axiosInstance.post(
            `/DanhMucLoaiDiTich/Delete?id=${record.key}`
          );
          if (response.data.status === 1) {
            message.success('Xóa loại di tích thành công!');
            fetchData(); // Refresh the data
          } else {
            message.error('Xóa loại di tích thất bại.');
          }
        } catch (error) {
          message.error('Lỗi khi xóa loại di tích.');
        }
      },
      onCancel: () => {
        message.info('Hủy thao tác xóa.');
      },
    });
  };

  const filteredData = dataSource.filter((item) =>
    item.TenLoaiDiTich?.toLowerCase().includes(searchName.toLowerCase())
  );

  const columns = [
    {
      title: 'Số thứ tự',
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
    },
    {
      title: 'Tên loại di tích',
      dataIndex: 'TenLoaiDiTich',
      key: 'TenLoaiDiTich',
      align: 'left',
    },
    {
      title: 'Thứ tự hiển thị',
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
  return (
    <Content style={contentStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ fontSize: 19, marginLeft: '10px' }}>DANH MỤC LOẠI DI TÍCH</h1>
        <Button type="primary" onClick={handleAddNew}>
          Thêm
        </Button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Search
          placeholder="Tìm kiếm theo tên"
          allowClear
          value={searchName}
          onChange={handleNameChange}
          style={{ width: 200 }}
        />
      </div>

      <Table
        className="custom-table"
        dataSource={filteredData}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingRecord ? 'Chỉnh sửa loại di tích' : 'Thêm loại di tích'}
        visible={isModalOpen}
        onCancel={handleModalCancel}
        onOk={handleModalSubmit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="TenLoaiDiTich"
            label="Tên loại di tích"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại di tích!' }]}
          >
            <Input placeholder="Nhập tên loại di tích" />
          </Form.Item>
          <Form.Item
            name="GhiChu"
            label="Thứ tự hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự hiển thị!' }]}
          >
            <Input placeholder="Nhập thứ tự hiển thị" />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};
export default Nguoidung;
