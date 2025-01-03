import React, { useState, useEffect } from 'react';
import { Input, Tree, message, Layout, Button, Menu, Modal, Form, Select } from 'antd';
import axiosInstance from './../../../utils/axiosInstance'; // Your axios instance setup

const contentStyle = {
  width: '100%',
  textAlign: 'center',
  height: '800px',
  color: '#fff',
  backgroundColor: '#fff',
  borderRadius: 1,
  border: '1px solid #ccc',
};

const { Search } = Input;
const { Content } = Layout;
const { confirm } = Modal;

const Donvi = () => {
  const [data, setData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, key: null });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axiosInstance
      .get('/CtgTieuChi/List')
      .then((response) => {
        if (response.data.status === 1) {
          setData(response.data.data);
        } else {
          message.error(response.data.message);
        }
      })
      .catch(() => {
        message.error('Failed to fetch data');
      });
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

  const onRightClick = ({ event, node }) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      key: node.key,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, key: null });
  };

  const handleDelete = (key) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tiêu chí này?',
      content: 'Thao tác này không thể hoàn tác.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        axiosInstance
          .post(`/CtgTieuChi/Delete?id=${key}`)
          .then((response) => {
            if (response.data.status === 1) {
              message.success('Xóa thành công!');
              fetchData(); // Reload data after deletion
            } else {
              message.error(response.data.message);
            }
          })
          .catch(() => {
            message.error('Xóa thất bại!');
          });
      },
    });
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'add') {
      showAddModal();
    } else if (key === 'edit') {
      showEditModal();
    } else if (key === 'delete') {
      handleDelete(contextMenu.key);
    }
    closeContextMenu();
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
    form.resetFields();
    form.setFieldsValue({ TieuChiChaID: contextMenu.key });
  };

  const showEditModal = () => {
    const item = data.find((item) => item.TieuChiID.toString() === contextMenu.key);
    if (!item) {
      message.error('Không tìm thấy tiêu chí để chỉnh sửa');
      return;
    }
    setSelectedItem(item);
    setIsEditModalVisible(true);
    form.setFieldsValue({
      MaTieuChi: item.MaTieuChi,
      TenTieuChi: item.TenTieuChi,
      KieuDuLieuCot: item.KieuDuLieuCot.toString(),
      GhiChu: item.GhiChu,
    });
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Add values:', values); // Log the values being sent
      const response = await axiosInstance.post('/CtgTieuChi/Insert', {
        MaTieuChi: values.MaTieuChi,
        TenTieuChi: values.TenTieuChi,
        TieuChiChaID: values.TieuChiChaID,
        KieuDuLieuCot: parseInt(values.KieuDuLieuCot, 10),
        LoaiTieuChi: values.LoaiTieuChi,
        GhiChu: values.GhiChu,
      });
      console.log('Add response:', response); // Log the response
      if (response.data.status === 1) {
        message.success('Thêm thành công!');
        fetchData();
      } else {
        message.error(response.data.message);
      }
      setIsAddModalVisible(false);
    } catch (error) {
      message.error('Failed to save');
      console.error('Add error:', error); // Log the error
    }
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Edit values:', values); // Log the values being sent
      const response = await axiosInstance.post(`/CtgTieuChi/Update?id=${selectedItem.TieuChiID}`, {
        tieuChiID: selectedItem.TieuChiID,
        MaTieuChi: values.MaTieuChi,
        TenTieuChi: values.TenTieuChi,
        KieuDuLieuCot: parseInt(values.KieuDuLieuCot, 10),
        GhiChu: values.GhiChu,
      });
      console.log('Edit response:', response); // Log the response
      if (response.data.status === 1) {
        message.success('Sửa thành công!');
        fetchData();
      } else {
        message.error(response.data.message);
      }
      setIsEditModalVisible(false);
    } catch (error) {
      message.error('Failed to save');
      console.error('Edit error:', error); // Log the error
    }
  };

  const generateTreeDataWithReportSections = (data) => {
    const headNode = {
      title: <strong style={{ fontSize: '18px', color: '#000' }}>Phần đầu báo cáo</strong>,
      key: 'head-node',
      children: [],
    };

    const bodyNode = {
      title: <strong style={{ fontSize: '18px', color: '#000' }}>Phần nội dung tiêu chí báo cáo</strong>,
      key: 'body-node',
      children: [],
    };

    const tailNode = {
      title: <strong style={{ fontSize: '18px', color: '#000' }}>Phần cuối báo cáo</strong>,
      key: 'tail-node',
      children: [],
    };

    const middleIndex = Math.floor(data.length / 2);
    const treeWithBody = [
      ...data.slice(0, middleIndex),
      bodyNode,
      ...data.slice(middleIndex),
    ];

    return [headNode, ...loop(treeWithBody), tailNode];
  };

  const loop = (data) =>
    data.map((item) => ({
      title: item.title || item.TenTieuChi,
      key: item.TieuChiID ? item.TieuChiID.toString() : item.key,
      children: item.children ? loop(item.children) : [],
    }));

  const treeDataWithSections = generateTreeDataWithReportSections(data);

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="add">Thêm chỉ tiêu</Menu.Item>
      <Menu.Item key="edit">Sửa</Menu.Item>
      <Menu.Item key="delete">Xóa</Menu.Item>
    </Menu>
  );

  return (
    <Content style={contentStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontWeight: 'bold', margin: 0, color: '#000' }}>DANH MỤC TIÊU CHÍ</h2>
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
      <Tree
        showLine
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={onExpand}
        treeData={treeDataWithSections}
        onRightClick={onRightClick}
      />
      {contextMenu.visible && (
        <div
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: 4,
            boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
          }}
          onMouseLeave={closeContextMenu}
        >
          {menu}
        </div>
      )}
      <Modal
        title="Thêm tiêu chí"
        visible={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={() => setIsAddModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="TieuChiChaID"
            label="Tiêu cột cha"
            rules={[{ required: true, message: 'Vui lòng nhập mã tiêu chí!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="MaTieuChi"
            label="Mã cột"
            rules={[{ required: true, message: 'Vui lòng nhập tên tiêu chí!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="TenTieuChi"
            label="Tên cột"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu chí cha!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="LoaiTieuChi"
            label="Loại tiêu chí"
            rules={[{ required: true, message: 'Vui lòng nhập loại tiêu chí!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="KieuDuLieuCot"
            label="Kiểu dữ liệu cột"
            rules={[{ required: true, message: 'Vui lòng nhập kiểu dữ liệu cột!' }]}
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
            rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Sửa tiêu chí"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="MaTieuChi"
            label="Mã cột"
            rules={[{ required: true, message: 'Vui lòng nhập mã cột!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="TenTieuChi"
            label="Tên cột"
            rules={[{ required: true, message: 'Vui lòng nhập tên cột!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="KieuDuLieuCot"
            label="Kiểu dữ liệu"
            rules={[{ required: true, message: 'Vui lòng nhập kiểu dữ liệu!' }]}
          >
            <Select placeholder="Chọn kiểu dữ liệu">
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
            rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default Donvi;