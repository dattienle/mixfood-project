
import { Avatar, Dropdown, Menu, Badge } from 'antd'
import { BellOutlined, UserOutlined } from '@ant-design/icons'

const userMenu = (
  <Menu>
    <Menu.Item key="logout">
      Đăng xuất
    </Menu.Item>
  </Menu>
)

const Navbar: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'space-between', padding: '0 30px'}}>
    
      <Dropdown  overlay={userMenu} placement="bottomRight">
        <Avatar style={{ marginRight: 20, backgroundColor: '#F8B602' }} icon={<UserOutlined />} />
      </Dropdown>
      <Badge count={5} style={{ marginLeft: 20 }}>
        <BellOutlined style={{ fontSize: '20px', color: '#F8B602' }} />
      </Badge>
    </div>
  )
}

export default Navbar
