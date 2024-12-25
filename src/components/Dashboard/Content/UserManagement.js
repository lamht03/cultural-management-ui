import React, { useState } from "react";
import { Button, Checkbox, List, Table } from "antd";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "tranviethung (Trần Việt Hưng - Sở Văn Hóa và Thể Thao)" },
  ]);

  const [permissions, setPermissions] = useState([
    { name: "Quản lý người sử dụng", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Quản lý phân quyền", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Quản lý truy cập, tham số", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Nhật ký sử dụng", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Sao lưu, phục hồi dữ liệu", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Quản lý hướng dẫn sử dụng", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
    { name: "Cấu hình đăng nhập hệ thống", actions: ["Xem", "Thêm", "Sửa", "Xóa"] },
  ]);

  const handleAddUser = () => {
    const newUser = { id: users.length + 1, name: "New User" }; // Replace with form input logic
    setUsers([...users, newUser]);
  };

  const columns = [
    { title: "Chức năng", dataIndex: "name", key: "name" },
    {
      title: "Xem",
      dataIndex: "xem",
      render: (_, record) => <Checkbox defaultChecked />,
    },
    {
      title: "Thêm",
      dataIndex: "them",
      render: (_, record) => <Checkbox defaultChecked />,
    },
    {
      title: "Sửa",
      dataIndex: "sua",
      render: (_, record) => <Checkbox defaultChecked />,
    },
    {
      title: "Xóa",
      dataIndex: "xoa",
      render: (_, record) => <Checkbox defaultChecked />,
    },
  ];

  const data = permissions.map((item, index) => ({
    key: index,
    name: item.name,
    xem: true,
    them: true,
    sua: true,
    xoa: true,
  }));

  return (
    <div>
      {/* Section Titles Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        
      </div>

      {/* Add User Section */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            width: "40%",
            border: "1px solid #d9d9d9",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
             <h3>Thêm người dùng</h3>
          <List
            dataSource={users}
            renderItem={(item) => (
              <List.Item actions={[<Button type="link" danger>X</Button>]}>
                {item.name}
              </List.Item>
            )}
          />
         
          
          <Button type="primary" onClick={handleAddUser}>
            Thêm người dùng
          </Button>
        </div>

        {/* Add Functionality Section */}
        <div
          style={{
            width: "60%",
            border: "1px solid #d9d9d9",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
            
            <h3>Thêm chức năng</h3>
          <div style={{ marginBottom: "10px" }}>
            <Button type="primary">Thêm chức năng</Button>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
