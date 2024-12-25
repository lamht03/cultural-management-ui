// Menu.js
import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const MenuComponent = ({ menuItems, openKeys, selectedKeys, handleOpenChange, handleClick }) => {
  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={handleOpenChange}
      onClick={handleClick}
      style={{ height: '100%' }}
    >
      {menuItems.map((item) =>
        item.children ? (
          <Menu.SubMenu key={item.key} title={item.label}>
            {item.children.map((subItem) => (
              <Menu.Item key={subItem.key} path={subItem.path}>
                <Link to={subItem.path}>{subItem.label}</Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={item.key} path={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ),
      )}
    </Menu>
  );
};

export default MenuComponent;
