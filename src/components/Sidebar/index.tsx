// components/Sidebar.tsx
import React from 'react'
import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  AppstoreOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import './style.scss'


type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC = () => {
  const navigate = useNavigate()

  const handleMenuClick = (key: string) => {
    switch (key) {
      case '1':
        navigate('/danh-muc')
        break
      case '2':
        navigate('/nguyen-lieu')
        break
      case '3':
        navigate('/option-3')
        break
 
      default:
        break
    }
  }

  const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: 'Danh Mục', onClick: () => handleMenuClick('1') },
    { key: '2', icon: <DesktopOutlined />, label: 'Nguyên Liệu', onClick: () => handleMenuClick('2') },
    { key: '3', icon: <ContainerOutlined />, label: 'Option 3', onClick: () => handleMenuClick('3') },
    {
      key: 'sub1',
      label: 'Navigation One',
      icon: <MailOutlined />,
      children: [
        { key: '5', label: 'Option 5' },
        { key: '6', label: 'Option 6' },
        { key: '7', label: 'Option 7' },
        { key: '8', label: 'Option 8' },
      ],
    },
    {
      key: 'sub2',
      label: 'Navigation Two',
      icon: <AppstoreOutlined />,
      children: [
        { key: '9', label: 'Option 9' },
        { key: '10', label: 'Option 10' },
      ],
    },
  ];

  return (
    <div className='sidebar'>
      <Menu
        theme='light'
        mode='inline'
        defaultSelectedKeys={['1']}
        items={items}
        defaultOpenKeys={['sub1']}
      />
    </div>
  )
}

export default Sidebar
