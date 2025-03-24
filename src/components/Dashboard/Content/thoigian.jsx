import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, message, Checkbox, Modal, Form, Radio } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axiosInstance';
const { Content } = Layout;
const { Search } = Input;
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
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const handleMonthToggle = (month) => {
    const newSelectedMonths = selectedMonths.includes(month)
      ? selectedMonths.filter((m) => m !== month) // Deselect month
      : [...selectedMonths, month]; // Select month
    setSelectedMonths(newSelectedMonths);
    form.setFieldsValue({ GhiChu: newSelectedMonths });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('v1/DanhMucKyBaoCao/DanhSachKyBaoCao?pageNumber=1&pageSize=20');
      if (response?.data?.status === 1) {
        const tableData = response.data.data.map((item, index) => ({
          key: item.KyBaoCaoID,
          stt: index + 1,
          TenKyBaoCao: item.TenKyBaoCao,
          GhiChu: item.GhiChu,
          TrangThai: item.TrangThai,
          LoaiKyBaoCao: item.LoaiKyBaoCao,
        }));
        setDataSource(tableData);
      } else {
        message.error('Lỗi khi tải dữ liệu!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };
  const handleNameChange = (e) => setSearchName(e.target.value);
  const onSearch = (value) => setSearchName(value);
  const openAddModal = () => {
    setModalMode('add');
    setCurrentRecord(null);
    form.resetFields();
    setSelectedMonths([]);
    setIsModalVisible(true);
  };
  const openEditModal = (record) => {
    setModalMode('edit');
    setCurrentRecord(record);
    const months = record.GhiChu ? record.GhiChu.split(',').map((month) => parseInt(month, 10)) : [];
    setSelectedMonths(months);
    form.setFieldsValue({
      TenKyBaoCao: record.TenKyBaoCao,
      GhiChu: months,
      TrangThai: record.TrangThai,
    });
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const payload = {
        TenKyBaoCao: values.TenKyBaoCao,
        GhiChu: selectedMonths.sort((a, b) => a - b).join(','),
        TrangThai: values.TrangThai,
      };
      if (modalMode === 'add') {
        const response = await axiosInstance.post('/v1/DanhMucKyBaoCao/ThemMoiKyBaoCao', payload);
        if (response?.data?.status === 1) {
          message.success('Thêm thành công!');
          setIsModalVisible(false);
          fetchData();
        } else {
          message.error('Có lỗi xảy ra khi thêm dữ liệu!');
        }
      } else if (modalMode === 'edit') {
        const response = await axiosInstance.post('/v1/DanhMucKyBaoCao/CapNhatKyBaoCao', {
          ...payload,
          KyBaoCaoID: currentRecord.key,
        });
        if (response?.data?.status === 1) {
          message.success('Sửa thành công!');
          setIsModalVisible(false);
          fetchData();
        } else {
          message.error('Có lỗi xảy ra khi sửa dữ liệu!');
        }
      }
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = dataSource.filter((item) =>
    (item.TenKyBaoCao || '').toLowerCase().includes(searchName.toLowerCase())
  );
  const handleDelete = async (record) => {
    try {
      // Show a confirmation modal before proceeding
      Modal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc chắn muốn xóa "${record.TenKyBaoCao}"?`,
        okText: 'Xóa',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            // Call the delete API with the id as a query parameter
            const response = await axiosInstance.post(
              `/v1/DanhMucKyBaoCao/XoaKyBaoCao?id=${record.key}`
            );
            if (response?.data?.status === 1) {
              message.success('Xóa thành công!');
              // Refresh the data
              fetchData();
            } else {
              message.error(response?.data?.message || 'Có lỗi xảy ra khi xóa.');
            }
          } catch (error) {
            message.error('Đã xảy ra lỗi khi xóa dữ liệu.');
          }
        },
      });
    } catch (error) {
      message.error('Không thể thực hiện yêu cầu.');
    }
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
    },
    {
      title: 'Tên Thời Gian',
      dataIndex: 'TenKyBaoCao',
      key: 'TenKyBaoCao',
      align: 'left',
    },
    {
      title: 'Mã Thời Gian',
      dataIndex: '',
      key: 'LoaiKyBaoCao',
      align: 'left',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      align: 'left',
    },
    {
      title: 'Loại Danh Mục',
      dataIndex: 'LoaiKyBaoCao',
      key: 'LoaiKyBaoCao',
      align: 'left',
    },
    {
      title: 'Đang sử dụng',
      dataIndex: 'TrangThai',
      key: 'TrangThai',
      align: 'center',
      render: (text) => <Checkbox checked={text} disabled />,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <span className="action-icons">
          <Button type="link" style={{ color: 'black', fontSize: '20px' }} onClick={() => openEditModal(record)}>
            <EditOutlined />
          </Button>
          <Button type="link" style={{ color: 'black', fontSize: '20px' }} onClick={() => handleDelete(record)} danger>
            <DeleteOutlined />
          </Button>
        </span>
      ),
    },
  ];

  return (
    
      <Content style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 className="text-2xl font-bold mb-6 text-center">DANH MỤC THỜI GIAN</h1>
          <Button type="primary" onClick={openAddModal}>
            <PlusOutlined /> Thêm
          </Button>
        </div>

        <Search
          placeholder="Tìm kiếm theo tên"
          allowClear
          value={searchName}
          onSearch={onSearch}
          onChange={handleNameChange}
          style={{ width: 200, marginBottom: 20 }}
        />

        <Table
          className="custom-table"
          dataSource={filteredData}
          columns={columns}
          rowKey="key"
          pagination={{
            pageSize: 5,
          }}
          loading={loading}
          locale={{ emptyText: 'Không có dữ liệu để hiển thị' }}
        />

        <Modal
          title={modalMode === 'add' ? 'Thêm Kỳ Báo Cáo' : 'Sửa Kỳ Báo Cáo'}
          visible={isModalVisible}
          onOk={handleSave}
          onCancel={handleCancel}
          okText="Lưu"
          cancelText="Hủy"
          width={700}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="TenKyBaoCao"
              label="Tên Thời Gian"
              rules={[{ required: true, message: 'Vui lòng nhập tên thời gian' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="GhiChu"
              label="Chọn thời gian (Tháng)"
              rules={[{ required: true, message: 'Vui lòng chọn ít nhất một tháng' }]}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', flexWrap: 'nowrap' }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <Button
                    key={month}
                    type={selectedMonths.includes(month) ? 'primary' : 'default'}
                    onClick={() => handleMonthToggle(month)}
                    style={{ flex: '0 1 auto', minWidth: '40px', textAlign: 'center' }}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </Form.Item>
            <Form.Item
              name="TrangThai"
              label="Đang sử dụng"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
  );
};
export default Nguoidung;