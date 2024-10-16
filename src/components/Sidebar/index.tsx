// components/Sidebar.tsx
import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppstoreOutlined, PieChartOutlined, DesktopOutlined, ContainerOutlined, MailOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import './style.scss'
import GetDataByToken from '~/auth/auth'

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const [userRole, setUserRole] = useState<string | null>(null)

  const pathToKeyMap: Record<string, string> = {
    '/manager/dashboard/danh-muc': '1',
    '/manager/dashboard/nguyen-lieu-da-duyet': '2.1',
    '/manager/dashboard/nguyen-lieu-chua-duyet': '2.2',
    '/manager/dashboard/dinh-duong': '3',
    '/manager/dashboard/thuc-don': '4',
    '/admin/dashboard/doanh-thu': '5'
  }

  const [selectedKey, setSelectedKey] = React.useState<string>('1')

  React.useEffect(() => {
    setSelectedKey(pathToKeyMap[location.pathname] || '1')
  }, [location.pathname])

  const handleMenuClick = (key: string) => {
    const keyToPathMap: Record<string, string> = {
      '1': '/manager/dashboard/danh-muc',
      '2.1': '/manager/dashboard/nguyen-lieu-da-duyet',
      '2.2': '/manager/dashboard/nguyen-lieu-chua-duyet',
      '3': '/manager/dashboard/dinh-duong',
      '4': '/manager/dashboard/thuc-don',
      '5': '/admin/dashboard/doanh-thu'
    }
    console.log(keyToPathMap[key])
    navigate(keyToPathMap[key])
  }

  useEffect(() => {
    const fetchUserRole = async () => {
      if (token) {
        try {
          const data = await GetDataByToken(token)
          if (data?.role) {
            setUserRole(data.role)
          } else {
            setUserRole('customer')
            console.warn('User role not found in token data.')
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
        }
      } else {
        console.warn('No token available')
      }
    }
    fetchUserRole()
  }, [token])
  const managerItems: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: 'Danh Mục', onClick: () => handleMenuClick('1') },
    {
      key: '2',
      icon: <DesktopOutlined />,
      label: 'Nguyên Liệu',
      children: [
        { key: '2.1', label: 'Đã phê duyệt ', onClick: () => handleMenuClick('2.1') },
        { key: '2.2', label: 'Chưa phê duyệt', onClick: () => handleMenuClick('2.2') }
      ]
    },
    { key: '3', icon: <ContainerOutlined />, label: 'Dinh Dưỡng', onClick: () => handleMenuClick('3') },
    {
      key: '4',
      label: 'Thực Đơn',
      icon: <MailOutlined />,
      onClick: () => handleMenuClick('4')
    },
   
  ]
  const adminItems: MenuItem[] = [
    {
      key: '5',
      label: 'Doanh thu',
      icon: <AppstoreOutlined />,
      onClick: () => handleMenuClick('5')
    }
  ]
  let displayedItems: MenuItem[] = []
  let defaultOpenKeys = '1'
  if(userRole === 'Manager' ) {
    displayedItems = managerItems;
  }else if(userRole === 'Admin'){
    displayedItems = adminItems
    defaultOpenKeys = '5'
  }
  return (
    <div className='sidebar'>
      <Menu theme='light' mode='inline' selectedKeys={[selectedKey]} items={displayedItems} defaultOpenKeys={[defaultOpenKeys]} />
    </div>
  )
}

export default Sidebar
