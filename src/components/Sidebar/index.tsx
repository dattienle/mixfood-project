// components/Sidebar.tsx
import React, { useState } from 'react'
import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()

  const pathToKeyMap: Record<string, string> = {
    '/danh-muc': '1',
    '/nguyen-lieu-da-duyet': '2.1',
    '/nguyen-lieu-chua-duyet': '2.2',
    '/dinh-duong': '3',
    '/thuc-don': '4',
    '/doanh-thu': '5',
  };

  const [selectedKey, setSelectedKey] = React.useState<string>('1');

  React.useEffect(() => {
    setSelectedKey(pathToKeyMap[location.pathname] || '1');
  }, [location.pathname]);

  const handleMenuClick = (key: string) => {
    const keyToPathMap: Record<string, string> = {
      '1': '/danh-muc',
      '2.1': '/nguyen-lieu-da-duyet',
      '2.2': '/nguyen-lieu-chua-duyet',
      '3': '/dinh-duong',
      '4': '/thuc-don',
      '5': '/doanh-thu',
    };
    navigate(keyToPathMap[key]);
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
      key: '5',
      label: 'Doanh thu',
      icon: <AppstoreOutlined />,
      onClick: () => handleMenuClick('5')
    },
  ];

  return (
    <div className='sidebar'>
      <Menu
        theme='light'
        mode='inline'
        selectedKeys={[selectedKey]}
        items={items}
        defaultOpenKeys={['1']}
      />
    </div>
  )
}

export default Sidebar
