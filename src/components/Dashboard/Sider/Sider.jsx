import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  SettingOutlined,
  DatabaseOutlined,
  FileOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const menuItems = [
  {
    key: "heThong",
    label: "Hệ thống",
    icon: <SettingOutlined />,
    children: [
      {
        key: "quanLyNguoiDung",
        label: "Quản lý người dùng",
        path: "/dashboard/quan-ly-nguoi-dung",
        icon: <UserOutlined />,
      },
      {
        key: "phanQuyen",
        label: "Quản lý phân quyền",
        path: "/dashboard/phan-quyen",
      },
    ],
  },
  {
    key: "quanLyDanhMuc",
    label: "Quản lý danh mục",
    icon: <DatabaseOutlined />,
    children: [
      {
        key: "danhMucCoQuan",
        label: "Danh mục cơ quan",
        path: "/dashboard/danh-muc-co-quan",
      },
      {
        key: "danhMucChiTieu",
        label: "Danh mục chỉ tiêu",
        path: "/dashboard/danh-muc-chi-tieu",
      },
      {
        key: "danhMucCot",
        label: "Danh mục cột báo cáo",
        path: "/dashboard/danh-muc-cot",
      },
      {
        key: "danhMucKyBaoCao",
        label: "Danh mục kỳ báo cáo",
        path: "/dashboard/danh-muc-ky-bao-cao",
      },
      {
        key: "danhMucCapDiTichXepHang",
        label: "Danh mục cấp di tích xếp hạng",
        path: "/dashboard/danh-muc-cap-di-tich-xep-hang",
      },
      {
        key: "danhmuloaiditich",
        label: "Danh mục loại di tích",
        path: "/dashboard/danh-muc-loai-di-tich",
      },
      {
        key: "danhmucdonvitinh",
        label: "Danh mục đơn vị tính",
        path: "/dashboard/danh-muc-don-vi-tinh",
      },
      {
        key: "danhmucloaimauphieu",
        label: "Danh mục loại mẫu phiếu",
        path: "/dashboard/danh-muc-loai-mau-phieu",
      },
    ],
  },
  {
    key: "HTTT",
    label: <strong>Quản lý HTTT tổng hợp báo cáo</strong>,
    children: [
      {
        key: "danhMucCoQuan1",
        label: "Thiết lập mẫu báo cáo",
        path: "/dashboard/mau-phieu",
      },
    ],
  },
];

const SiderMenu = () => {
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let keys = [];
    const findKey = (items) => {
      for (const item of items) {
        if (item.children) {
          for (const child of item.children) {
            if (child.path === path) {
              keys.push(item.key);
              keys.push(child.key);
              return;
            }
          }
        }
      }
    };
    findKey(menuItems);
    setSelectedKeys([keys.pop()]);
    setOpenKeys(keys);
  }, [location.pathname]);

  const handleOpenChange = (keys) => {
    if (keys.length === 0) {
      setOpenKeys([]);
    } else {
      const latestKey = keys[keys.length - 1];
      if (menuItems.some((item) => item.key === latestKey)) {
        setOpenKeys([latestKey]); // Chỉ giữ lại menu cha mới nhất
      } else {
        setOpenKeys(keys);
      }
    }
  };
  const handleClick = (e) => {
    setSelectedKeys([e.key]);
    const menuItem = menuItems
      .flatMap((group) => group.children || [])
      .find((item) => item.key === e.key);
    if (menuItem && menuItem.path) {
      navigate(menuItem.path);
    }
  };

  return (
    <Sider
      width={260}
      style={{
        background: "#001529",
        minHeight: "100vh",
        color: "#fff",
        paddingTop: "16px",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Quản lý hệ thống
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleClick}
        style={{ fontSize: "16px" }}
      >
        {menuItems.map((menu) => (
          <Menu.SubMenu
            key={menu.key}
            icon={menu.icon}
            title={menu.label}
            style={{ fontWeight: "bold" }}
          >
            {menu.children.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ))}
      </Menu>
    </Sider>
  );
};

export default SiderMenu;
