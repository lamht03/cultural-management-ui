import React, { useEffect, useState } from 'react';
import { Layout, Input, Tree, Select, Button, Menu, Dropdown, Modal, Form, message } from 'antd';
import '../../../assets/css/Nguoidung.css';
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

const Donvi = () => {
  const [data, setData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [loaiMauPhieuList, setLoaiMauPhieuList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'delete'
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/CtgChiTieu/List');
        if (response.data.status === 1) {
          setData(response.data.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchLoaiMauPhieu = async () => {
      try {
        const response = await axiosInstance.get('/CtgLoaiMauPhieu/List?pageNumber=1&pageSize=20');
        if (response.data.status === 1) {
          setLoaiMauPhieuList(response.data.data);
        } else {
          setError('Failed to fetch LoaiMauPhieu data');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchLoaiMauPhieu();
  }, []);

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onSearch = (value) => {
    setSearchValue(value);
    const keys = [];
    const searchTree = (nodes) => {
      nodes.forEach((node) => {
        if (node.TenChiTieu.toLowerCase().includes(value.toLowerCase())) {
          keys.push(node.ChiTieuID.toString());
        }
        if (node.children) {
          searchTree(node.children);
        }
      });
    };
    searchTree(data);
    setExpandedKeys(keys);
    setAutoExpandParent(true);
  };

  const showModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalVisible(true);
    if (type === 'edit') {
      form.setFieldsValue({
        MaChiTieu: item.MaChiTieu,
        TenChiTieu: item.TenChiTieu,
        ChiTieuChaID: item.ChiTieuChaID,
        GhiChu: item.GhiChu,
        LoaiMauPhieuID: item.LoaiMauPhieuID,
      });
    }
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
    form.resetFields();
  };

  const handleMenuClick = (type) => {
    if (type === 'add') {
      showAddModal();
    } else if (type === 'edit') {
      showModal('edit', selectedItem);
    } else if (type === 'delete') {
      confirmDelete(selectedItem.ChiTieuID);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Xóa dữ liệu',
      content: 'Bạn có muốn xóa chỉ tiêu này không?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.post(`/CtgChiTieu/Delete?id=${id}`);
      if (response.data.status === 1) {
        message.success('Deleted successfully');
        // Refresh data after deletion
        setData(data.filter(item => item.ChiTieuID !== id));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('Failed to delete');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'edit') {
        // Edit existing item
        const response = await axiosInstance.post(`/CtgChiTieu/Update?id=${selectedItem.ChiTieuID}`, values);
        if (response.data.status === 1) {
          message.success('Updated successfully');
          setData(data.map(item => (item.ChiTieuID === selectedItem.ChiTieuID ? response.data.data : item)));
        } else {
          message.error(response.data.message);
        }
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      // Add new item
      const response = await axiosInstance.post('/CtgChiTieu/Insert', values);
      if (response.data.status === 1) {
        message.success('Added successfully');
        setData([...data, response.data.data]);
      } else {
        message.error(response.data.message);
      }
      setIsAddModalVisible(false);
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuClick(key)}>
      <Menu.Item key="add">Thêm chỉ tiêu</Menu.Item>
      <Menu.Item key="edit">Sửa</Menu.Item>
      <Menu.Item key="delete">Xóa</Menu.Item>
    </Menu>
  );

  const loop = (data) =>
    data.map((item) => {
      const index = item.TenChiTieu.toLowerCase().indexOf(searchValue.toLowerCase());
      const beforeStr = item.TenChiTieu.substring(0, index);
      const afterStr = item.TenChiTieu.substring(index + searchValue.length);
      const title =
        index > -1 ? (
          <Dropdown overlay={menu} trigger={['contextMenu']} onVisibleChange={(flag) => flag && setSelectedItem(item)}>
            <span>
              {beforeStr}
              <span style={{ color: 'red' }}>{searchValue}</span>
              {afterStr}
            </span>
          </Dropdown>
        ) : (
          <Dropdown overlay={menu} trigger={['contextMenu']} onVisibleChange={(flag) => flag && setSelectedItem(item)}>
            <span>{item.TenChiTieu}</span>
          </Dropdown>
        );
      if (item.children) {
        return { ...item, title, children: loop(item.children) };
      }
      return { ...item, title };
    });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: 19 }}>DANH MỤC CHI TIÊU</h1>
          <Button type="primary">Thêm</Button>
        </div>
        <Search
          placeholder="Tìm kiếm theo tên cơ quan, đơn vị"
          onChange={(e) => onSearch(e.target.value)}
          style={{ marginBottom: 20, width: 400 }}
        />
        <Select
          placeholder="Chọn loại mẫu Phiếu"
          style={{ width: '200px', marginBottom: 20 }}
        >
          {loaiMauPhieuList.map((item) => (
            <Select.Option key={item.LoaiMauPhieuID} value={item.LoaiMauPhieuID}>
              {item.TenLoaiMauPhieu}
            </Select.Option>
          ))}
        </Select>
        <Tree
          showLine
          defaultExpandAll
          onExpand={onExpand}
          treeData={loop(data)}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        />
        <Modal
          title="Thêm chỉ tiêu"
          visible={isAddModalVisible}
          onOk={handleAddOk}
          onCancel={() => setIsAddModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="ChiTieuChaID"
              label="Chỉ tiêu cha"
              rules={[{ required: true, message: 'Vui lòng nhập chỉ tiêu cha!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="MaChiTieu"
              label="Mã chỉ tiêu"
              rules={[{ required: true, message: 'Vui lòng nhập mã chỉ tiêu!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="TenChiTieu"
              label="Tên chỉ tiêu"
              rules={[{ required: true, message: 'Vui lòng nhập tên chỉ tiêu!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="LoaiMauPhieuID"
              label="Loại mẫu phiếu"
              rules={[{ required: true, message: 'Vui lòng chọn loại mẫu phiếu!' }]}
            >
              <Select>
                {loaiMauPhieuList.map((item) => (
                  <Select.Option key={item.LoaiMauPhieuID} value={item.LoaiMauPhieuID}>
                    {item.TenLoaiMauPhieu}
                  </Select.Option>
                ))}
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
        <Modal
          title={modalType === 'edit' ? 'Sửa chỉ tiêu' : ''}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="MaChiTieu"
              label="Mã chỉ tiêu"
              rules={[{ required: true, message: 'Vui lòng nhập mã chỉ tiêu!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="TenChiTieu"
              label="Tên chỉ tiêu"
              rules={[{ required: true, message: 'Vui lòng nhập tên chỉ tiêu!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ChiTieuChaID"
              label="Chỉ tiêu cha ID"
              rules={[{ required: true, message: 'Vui lòng nhập chỉ tiêu cha ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="LoaiMauPhieuID"
              label="Loại mẫu phiếu"
              rules={[{ required: true, message: 'Vui lòng chọn loại mẫu phiếu!' }]}
            >
              <Select>
                {loaiMauPhieuList.map((item) => (
                  <Select.Option key={item.LoaiMauPhieuID} value={item.LoaiMauPhieuID}>
                    {item.TenLoaiMauPhieu}
                  </Select.Option>
                ))}
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
    </Layout>
  );
};

export default Donvi;