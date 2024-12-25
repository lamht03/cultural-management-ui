import React, { useState, useEffect } from 'react';
import { Input, Tree, message, Layout, Button } from 'antd';
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

const Donvi = () => {
  const [data, setData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  useEffect(() => {
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
  }, []);

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

  const generateTreeDataWithReportSections = (data) => {
    const headNode = {
      title: <strong style={{ fontSize: '18px',color: '#000' }}>Phần đầu báo cáo</strong>,
      key: 'head-node',
      children: [],
    };

    const bodyNode = {
      title: <strong style={{ fontSize: '18px',color: '#000' }}>Phần nội dung tiêu chí báo cáo</strong>,
      key: 'body-node',
      children: [],
    };

    const tailNode = {
      title: <strong style={{ fontSize: '18px',color: '#000' }}>Phần cuối báo cáo</strong>,
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

  return (
    <Content style={contentStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontWeight: 'bold', margin: 0, color: '#000' }}>DANH MỤC TIÊU CHÍ</h2>
        <Button type="primary">Thêm mới</Button>
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
      />
    </Content>
  );
};
export default Donvi;
