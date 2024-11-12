import { Avatar, Dropdown, Menu, Badge } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import React from 'react'
const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Hàm xử lý logout
  const handleLogout = () => {
    // Xóa token khỏi localStorage
    sessionStorage.removeItem('token');
    // Điều hướng về trang đăng nhập
    navigate('/dang-nhap');
  };

  // Menu logout với sự kiện click
  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
      <Dropdown overlay={userMenu} placement="bottomRight">
        <Avatar style={{ marginRight: 20, backgroundColor: '#F8B602' }} icon={<UserOutlined />} />
      </Dropdown>
      <Badge count={5} style={{ marginLeft: 20 }}>
        <BellOutlined style={{ fontSize: '20px', color: '#F8B602' }} />
      </Badge>
    </div>
  );
};

export default Navbar;
