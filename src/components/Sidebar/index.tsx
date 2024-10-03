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
      case '2.1':
        navigate('/nguyen-lieu-da-duyet')
        break
      case '2.2':
        navigate('/nguyen-lieu-chua-duyet')
        break
      case '3':
        navigate('/dinh-duong')
        break
      case '4':
        navigate('/thuc-don') 
        break
      default:
        break
    }
  }

  const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: 'Danh Mục', onClick: () => handleMenuClick('1') },
    { key: '2', icon: <DesktopOutlined />, label: 'Nguyên Liệu'
      
      ,
      children:[
        { key: '2.1', label: 'Đã phê duyệt ' , onClick: () => handleMenuClick('2.1')},
        { key: '2.2', label: 'Chưa phê duyệt', onClick:() => handleMenuClick('2.2') },
      ],
       },
    { key: '3', icon: <ContainerOutlined />, label: 'Dinh Dưỡng', onClick: () => handleMenuClick('3') },
    {
      key: '4',
      label: 'Thực Đơn',
      icon: <MailOutlined />,
      onClick: () => handleMenuClick('4')
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
