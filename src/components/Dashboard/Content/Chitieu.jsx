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
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/v1/DanhMucChiTieu/DanhSachChiTieu');
        if (response.data.status === 1) {
          setData(response.data.data);
        } else {
          message.error('Failed to fetch data');
        }
      } catch (err) {
        message.error('Failed to fetch data: ' + err.message);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchLoaiMauPhieu = async () => {
      try {
        const response = await axiosInstance.get('/v1/DanhMucLoaiMauPhieu/DanhSachLoaiMauPhieu?pageNumber=1&pageSize=20');
        if (response.data.status === 1) {
          setLoaiMauPhieuList(response.data.data);
        } else {
          message.error('Failed to fetch LoaiMauPhieu data');
        }
      } catch (err) {
        message.error('Failed to fetch LoaiMauPhieu data: ' + err.message);
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
  const findParentItem = (data, id) => {
    let parent = null;
    const search = (items) => {
      for (const item of items) {
        if (item.children) {
          if (item.ChiTieuID === id) {
            parent = item;
            return;
          }
          search(item.children);
        }
      }
    };
    search(data);
    return parent;
  };
  const showModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalVisible(true);
    if (type === 'edit') {
      const parentItem = findParentItem(data, item.ChiTieuChaID);
      form.setFieldsValue({
        MaChiTieu: item.MaChiTieu,
        TenChiTieu: item.TenChiTieu,
        ChiTieuChaID: item.ChiTieuChaID,
        GhiChu: item.GhiChu,
        LoaiMauPhieuID: item.LoaiMauPhieuID,
        TenChiTieuCha: parentItem ? parentItem.TenChiTieu : '', // Set parent name
      });
    }
  };
  const showAddModal = (item) => {
    setIsAddModalVisible(true);
    form.resetFields();
    // If there is an item, fill in the parent item information
    if (item) {
      form.setFieldsValue({
        TenChiTieuCha: item.TenChiTieu, // Parent item name
        ChiTieuChaID: item.ChiTieuID,   // Parent item ID
      });
    }
  };
  const handleMenuClick = (type) => {
    if (type === 'add') {
      showAddModal(selectedItem);
    } else if (type === 'edit' && selectedItem) {
      showModal('edit', selectedItem);
    } else if (type === 'delete' && selectedItem) {
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
      const response = await axiosInstance.post(`/v1/DanhMucChiTieu/XoaChiTieu?id=${id}`);
      if (response.data.status === 1) {
        message.success('Deleted successfully');    
        setData(data.filter((item) => item.ChiTieuID !== id));
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
      if (modalType === 'edit' && selectedItem) {
        const response = await axiosInstance.post('/v1/DanhMucChiTieu/CapNhatThongTinChiTieu', {
          ChiTieuID: selectedItem.ChiTieuID,
          ChiTieuChaID: values.ChiTieuChaID || 0,
          MaChiTieu: values.MaChiTieu,
          TenChiTieu: values.TenChiTieu,
          LoaiMauPhieuID: values.LoaiMauPhieuID,
          GhiChu: values.GhiChu,
          TenChiTieuCha: values.TenChiTieuCha,
        });
        if (response.data.status === 1) {
          message.success('Updated successfully');
          // Update the data state with the new item
          setData(data.map((item) => (item.ChiTieuID === selectedItem.ChiTieuID ? response.data.data : item)));
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
      const dataToSend = {
        MaChiTieu: values.MaChiTieu,
        TenChiTieu: values.TenChiTieu,
        ChiTieuChaID: values.ChiTieuChaID || 0,
        GhiChu: values.GhiChu || "",
        LoaiMauPhieuID: values.LoaiMauPhieuID,
        TenChiTieuCha: values.TenChiTieuCha,
      };
      const response = await axiosInstance.post('/v1/DanhMucChiTieu/ThemMoiChiTieu', dataToSend);
      if (response.data.status === 1) {
        message.success('Added successfully');
        // Add the new item to the data state
        setData([...data, response.data.data]);
      } else {
        message.error(response.data.message);
      }
      setIsAddModalVisible(false);
    } catch (error) {
      message.error('Failed to save');
    }
  };
  const getChiTieuChaOptions = (data) => {
    const options = [];
    const loop = (items) => {
      items.forEach((item) => {
        if (item && item.ChiTieuID && item.TenChiTieu) {
          options.push({
            value: item.ChiTieuID,
            label: item.TenChiTieu,
          });
          if (item.children && item.children.length > 0) {
            loop(item.children);
          }
        }
      });
    };
    loop(data);
    return options;
  };
  const menu = (
    <Menu onClick={({ key }) => handleMenuClick(key)}>
      <Menu.Item key="add">Thêm chỉ tiêu</Menu.Item>
      <Menu.Item key="edit" disabled={!selectedItem}>
        Sửa
      </Menu.Item>
      <Menu.Item key="delete" disabled={!selectedItem}>
        Xóa
      </Menu.Item>
    </Menu>
  );
  const loop = (data) =>
    data
      .map((item) => {
        if (!item || !item.TenChiTieu) return null;
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
              <span onClick={() => showAddModal(item)}>{item.TenChiTieu}</span>
            </Dropdown>
          );
        if (item.children && item.children.length > 0) {
          return { ...item, title, children: loop(item.children) };
        }
        return { ...item, title };
      })
      .filter((item) => item !== null); // Filter out null values
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 className="text-2xl font-bold mb-6 text-center">DANH MỤC CHI TIÊU         </h1>
          <Button type="primary" onClick={() => showAddModal(null)}>
            Thêm chỉ tiêu
          </Button>
        </div>
        <Search placeholder="Tìm kiếm" onSearch={onSearch} style={{ width: 200 }} />
        <Select style={{ width: 200 }} options={loaiMauPhieuList.map((item) => ({ value: item.LoaiMauPhieuID, label: item.TenLoaiMauPhieu }))} />
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Tree
            showLine
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onExpand={onExpand}
            treeData={loop(data)}
          />
        </div>
        <Modal
          title="Thêm chỉ tiêu"
          visible={isAddModalVisible}
          onOk={handleAddOk}
          onCancel={() => setIsAddModalVisible(false)}
        >
          <Form form={form} layout="vertical" name="form_add">
            <Form.Item name="TenChiTieuCha" label="Chỉ tiêu cha" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="ChiTieuChaID" label="ID Chỉ tiêu cha" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="MaChiTieu" label="Mã chỉ tiêu" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="TenChiTieu" label="Tên chỉ tiêu" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="LoaiMauPhieuID" label="Loại mẫu phiếu" rules={[{ required: true }]}>
              <Select 
                options={loaiMauPhieuList.map((item) => ({ value: item.LoaiMauPhieuID, label: item.TenLoaiMauPhieu }))} 
              />
            </Form.Item>
            <Form.Item name="GhiChu" label="Ghi Chú">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Chỉnh sửa chỉ tiêu"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical" name="form_edit">
            <Form.Item name="TenChiTieuCha" label="Chỉ tiêu cha" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="ChiTieuChaID" label="ID Chỉ tiêu cha" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="MaChiTieu" label="Mã chỉ tiêu" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="TenChiTieu" label="Tên chỉ tiêu" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="LoaiMauPhieuID" label="Loại mẫu phiếu" rules={[{ required: true }]}>
              <Select 
                options={loaiMauPhieuList.map((item) => ({ value: item.LoaiMauPhieuID, label: item.TenLoaiMauPhieu }))} 
              />
            </Form.Item>
            <Form.Item name="GhiChu" label="Ghi Chú">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};
export default Donvi;