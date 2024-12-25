import React, { useEffect, useState } from 'react';
import { Layout, Input, Tree, Select, Button, Menu, Dropdown, Modal,message } from 'antd';
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
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'delete'

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
  };

  const handleMenuClick = (type) => {
    if (type === 'add') {
      showModal('add', selectedItem);
    } else if (type === 'edit') {
      showModal('edit', selectedItem);
    } else if (type === 'delete') {
      showModal('delete', selectedItem);
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
          <Dropdown overlay={menu} trigger={['contextMenu']}>
            <span>
              {beforeStr}
              <span style={{ color: 'red' }}>{searchValue}</span>
              {afterStr}
            </span>
          </Dropdown>
        ) : (
          <Dropdown overlay={menu} trigger={['contextMenu']}>
            <span>{item.TenChiTieu}</span>
          </Dropdown>
        );
      if (item.children) {
        return { ...item, title, children: loop(item.children) };
      }
      return { ...item, title };
    });

    
  return (
   
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
      </Content>

  );
};

export default Donvi;
