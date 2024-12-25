import React, { useState } from 'react';
import { Layout, Input, Tree } from 'antd';
import '../../../assets/css/Nguoidung.css'; // File CSS cho bảng

const { Content } = Layout;
const { Search } = Input;

const treeData = [
  {
    title: 'Sở Văn hóa và Thể thao',
    key: '0-0',
    children: [
      { title: 'Ban Tiếp Công dân tỉnh', key: '0-0-0' },
      { title: 'Thanh tra tỉnh', key: '0-0-1' },
      { title: 'Sở Tài Chính', key: '0-0-2' },
      { title: 'Sở Lao Động TB & XH', key: '0-0-3' },
      { title: 'Sở Xây Dựng', key: '0-0-4' },
      { title: 'Sở Công Thương', key: '0-0-5' },
      {
        title: 'Sở Văn Hóa và Thể Thao',
        key: '0-0-6',
        children: [
          {
            title: 'Phòng ban thuộc Sở',
            key: '0-0-6-0',
            children: [
              {
                title: 'Cấp con của cấp phòng',
                key: '0-0-6-0-0',
              },
            ],
          },
          { title: 'Sở Y Tế', key: '0-0-6-1' },
          { title: 'Sở Nội Vụ', key: '0-0-6-2' },
          { title: 'Sở Tư Pháp', key: '0-0-6-3' },
          { title: 'Sở Ngoại Vụ', key: '0-0-6-4' },
          { title: 'Sở Tài Nguyên Và Môi Trường', key: '0-0-6-5' },
          { title: 'Sở Giao Thông Vận Tải', key: '0-0-6-6' },
          { title: 'Sở Thông Tin và Truyền Thông', key: '0-0-6-7' },
          { title: 'Sở Khoa Học và Công nghệ', key: '0-0-6-8' },
          { title: 'Sở Kế Hoạch và Đầu Tư', key: '0-0-6-9' },
          { title: 'Sở Giáo Dục và Đào Tạo', key: '0-0-6-10' },
          { title: 'Sở Nông Nghiệp Phát Triển Nông Thôn', key: '0-0-6-11' },
        ],
      },
    ],
  },
];

const contentStyle = {
  width: '100%',
  height: '100%',
  color: '#000',
  backgroundColor: '#fff',
  borderRadius: 1,
  border: '1px solid #ccc',
  padding: '20px',
};

const Donvi = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onSelect = (selectedKeys, info) => {
    console.log('Selected:', selectedKeys, info);
  };

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onSearch = (value) => {
    setSearchValue(value);
    const keys = [];
    const searchTree = (nodes) => {
      nodes.forEach((node) => {
        if (node.title.toLowerCase().includes(value.toLowerCase())) {
          keys.push(node.key);
        }
        if (node.children) {
          searchTree(node.children);
        }
      });
    };
    searchTree(treeData);
    setExpandedKeys(keys);
    setAutoExpandParent(true);
  };

  const loop = (data) =>
    data.map((item) => {
      const index = item.title.toLowerCase().indexOf(searchValue.toLowerCase());
      const beforeStr = item.title.substring(0, index);
      const afterStr = item.title.substring(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: 'red' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { ...item, title, children: loop(item.children) };
      }
      return { ...item, title };
    });

  return (
    
      <Content style={contentStyle}>
        <h1 style={{ marginBottom: 20, fontSize: 20, fontWeight: 'bold' }}>
          DANH MỤC CƠ QUAN, ĐƠN VỊ
        </h1>

        {/* Search Bar */}
        <Search
          placeholder="Tìm kiếm theo tên cơ quan, đơn vị"
          onChange={(e) => onSearch(e.target.value)}
          style={{ marginBottom: 20, width: 400 }}
        />
        <Tree
          showLine
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={loop(treeData)}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        />
      </Content>
    
  );
};

export default Donvi;
