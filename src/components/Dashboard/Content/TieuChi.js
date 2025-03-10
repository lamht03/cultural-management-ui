import React, { useState, useEffect } from 'react';
import { Input, Tree, message, Layout, Button, Menu, Dropdown, Modal, Form, Select } from 'antd';
import axiosInstance from './../../../utils/axiosInstance';
const { Content } = Layout;
const { Search } = Input;
const contentStyle = {
  width: '100%',
  textAlign: 'center',
  height: '800px',
  color: '#fff',
  backgroundColor: '#fff',
  borderRadius: 1,
  border: '1px solid #ccc',
};
const Donvi = () => {
  const [data, setData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'delete'
  const [form] = Form.useForm();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/v1/DanhMucTieuChi/DanhSachTieuChi');
      if (response.data.status === 1) {
        setData(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('Failed to fetch data');
    }
  };
  const onSearch = (value) => {
    const expandedKeys = [];
    const search = (data) =>
      data
        .map((item) => {
          if (item.TenTieuChi.toLowerCase().includes(value.toLowerCase())) {
            expandedKeys.push(item.TieuChiID);
            return {
              ...item,
              title: <span style={{ color: 'red' }}>{item.TenTieuChi}</span>,
              children: item.children ? search(item.children) : [],
            };
          }
          if (item.children) {
            return {
              ...item,
              children: search(item.children),
            };
          }
          return null;
        })
        .filter((item) => item);
    const newData = search(data);
    setData(newData);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  };
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const handleMenuClick = (key) => {
    if (key === 'add') {
      showAddModal();
    } else if (key === 'edit') {
      showModal('edit', selectedItem);
    } else if (key === 'delete') {
      confirmDelete(selectedItem.TieuChiID);
    }
  };
  const showModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalVisible(true);
    if (type === 'edit' && item) {
      form.setFieldsValue({
        MaTieuChi: item.MaTieuChi,
        TenTieuChi: item.TenTieuChi,
        GhiChu: item.GhiChu,
        TieuChiChaID: item.TieuChiChaID,
        KieuDuLieuCot: item.KieuDuLieuCot,
        LoaiTieuChi: item.LoaiTieuChi,
      });
    }
  };
  const showAddModal = () => {
    setModalType('add');
    setSelectedItem(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Xóa dữ liệu',
      content: 'Bạn có muốn xóa tiêu chí này không?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.post(`/v1/DanhMucTieuChi/XoaTieuChi?id=${id}`);
      if (response.data.status === 1) {
        message.success('Xóa thành công');
        fetchData(); // Refresh data after deletion
      } else {
        message.error(response.data.message || 'Failed to delete');
      }
    } catch (error) {
      message.error('Failed to delete. Please try again later.');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const apiEndpoint = modalType === 'edit' ? 'v1/DanhMucTieuChi/CapNhatTieuChi' : '/v1/DanhMucTieuChi/ThemMoiTieuChi';
      const response = await axiosInstance.post(apiEndpoint, {
        ...values,
        TieuChiID: selectedItem ? selectedItem.TieuChiID : undefined, // Include ID only for edit
      });
      if (response.data.status === 1) {
        message.success(modalType === 'edit' ? 'Cập nhật thành công' : 'Thêm thành công');
        fetchData(); // Refresh data after add/edit
      } else {
        message.error(response.data.message);
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuClick(key)}>
      <Menu.Item key="add">Thêm tiêu chí</Menu.Item>
      <Menu.Item key="edit" disabled={!selectedItem}>Sửa</Menu.Item>
      <Menu.Item key="delete" disabled={!selectedItem}>Xóa</Menu.Item>
    </Menu>
  );

  const generateTreeDataWithReportSections = (data) => {
    // Lọc dữ liệu theo LoaiTieuChi
    const headData = data.filter(item => item.LoaiTieuChi === 1);
    const bodyData = data.filter(item => item.LoaiTieuChi === 2);
    const tailData = data.filter(item => item.LoaiTieuChi === 3);
  
    // Tạo các node với dữ liệu đã lọc
    const headNode = {
      title: <strong style={{ fontSize: '18px', color: '#000' }}>Phần đầu báo cáo</strong>,
      key: 'head-node',
      children: loop(headData), // Sử dụng dữ liệu phần đầu
    };
    const bodyNode = {
      title: <strong style={{ fontSize: '18px', color: '#000' }}>Phần nội dung tiêu chí báo cáo</strong>,
      key: 'body-node',
      children: loop(bodyData), // Sử dụng dữ liệu phần thân
    };
    const tailNode = {
      title: <strong style={{ fontSize: '18px', color: '#000' }}>Phần cuối báo cáo</strong>,
      key: 'tail-node',
      children: loop(tailData), // Sử dụng dữ liệu phần cuối
    };
  
    return [headNode, bodyNode, tailNode];
  };

  const loop = (data) =>
    data.map((item) => {
      const title = (
        <Dropdown overlay={menu} trigger={['contextMenu']} onVisibleChange={(flag) => flag && setSelectedItem(item)}>
          <span>{item.TenTieuChi || 'No Title'}</span>
        </Dropdown>
      );
      const key = item.TieuChiID ? item.TieuChiID.toString() : item.key || 'default-key';
      const children = item.children && Array.isArray(item.children) ? loop(item.children) : [];
      return {
        title,
        key,
        children,
      };
    });

  const treeDataWithSections = generateTreeDataWithReportSections(data);

  return (
    <Content style={contentStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#000' }}>DANH MỤC TIÊU CHÍ</h1>
        <Button type="primary" onClick={showAddModal}>Thêm mới</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px' }}>
        <Search
          placeholder="Tìm kiếm theo tiêu chí"
          onSearch={onSearch}
          style={{ width: 300, marginRight: '10px' }}
          allowClear
        />
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
      <Tree
        showLine
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={onExpand}
        treeData={treeDataWithSections}
      />
      </div>
      <Modal
        title={modalType === 'add' ? "Thêm tiêu chí" : "Sửa tiêu chí"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
        <Form.Item
  name="TieuChiChaID"
  label="Tiêu chí cha"
  rules={[{ required: true, message: 'Vui lòng chọn tiêu chí cha!' }]}
>
  <Select placeholder="Chọn tiêu chí cha">
    {data.map((item) => (
      <React.Fragment key={item.TieuChiID}>
        <Select.Option value={item.TieuChiID}>
          {item.TenTieuChi}
        </Select.Option>
        
        {/* Duyệt qua children nếu có */}
        {item.children && item.children.length > 0 &&
          item.children.map((child) => (
            <Select.Option key={child.TieuChiID} value={child.TieuChiID}>
              {child.TenTieuChi}
            </Select.Option>
          ))}
      </React.Fragment>
    ))}
  </Select>
</Form.Item>
          <Form.Item
            name="MaTieuChi"
            label="Mã tiêu chí"
            rules={[{ required: true, message: 'Vui lòng nhập mã tiêu chí!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="TenTieuChi"
            label="Tên tiêu chí"
            rules={[{ required: true, message: 'Vui lòng nhập tên tiêu chí!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="KieuDuLieuCot"
            label="Kiểu dữ liệu cột"
            rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu cột!' }]}
          >
            <Select placeholder="Chọn kiểu dữ liệu cột">
              <Select.Option value="0">Kiểu số</Select.Option>
              <Select.Option value="1">Kiểu chữ</Select.Option>
              <Select.Option value="2">Kiểu số thập phân</Select.Option>
              <Select.Option value="3">Kiểu dung sai</Select.Option>
              <Select.Option value="4">Kiểu ngày tháng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};
export default Donvi;
