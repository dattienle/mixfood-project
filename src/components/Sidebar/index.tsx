// components/Sidebar.tsx
import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppstoreOutlined, PieChartOutlined, DesktopOutlined, ContainerOutlined, MailOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import './style.scss'
import GetDataByToken from '../../auth/auth'
// import GetDataByToken from '~/auth/auth'

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = sessionStorage.getItem('token')
  const [userRole, setUserRole] = useState<string | null>(null)

  const pathToKeyMap: Record<string, string> = {
    '/manager/dashboard/danh-muc': '1',
    '/manager/dashboard/nguyen-lieu-da-duyet': '2.1',
    '/manager/dashboard/nguyen-lieu-chua-duyet': '2.2',
    '/manager/dashboard/dinh-duong-da-duyet': '3',
    '/manager/dashboard/thuc-don': '4',
    '/manager/dashboard/loai-nguyen-lieu': '5',

    '/admin/dashboard/doanh-thu': '6',
    '/nutritionist/dashboard/chat': '7',
     '/nutritionist/dashboard/nguyen-lieu-chua-duyet': '8',
     '/staff/dashboard/order': '9',
     '/staff/dashboard/calendar': '10',
     '/nutritionist/dashboard/thanh-phan-nguyen-lieu': '11',

     
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
      '3': '/manager/dashboard/dinh-duong-da-duyet',
      '4': '/manager/dashboard/thuc-don',
      '5': '/manager/dashboard/loai-nguyen-lieu',
      '6': '/admin/dashboard/doanh-thu',
      '7': '/nutritionist/dashboard/chat',
      '8': '/nutritionist/dashboard/nguyen-lieu-chua-duyet',
      '9': '/staff/dashboard/order',
      '10': '/staff/dashboard/calendar',
      '11': '/nutritionist/dashboard/thanh-phan-nguyen-lieu',


    }
    console.log(keyToPathMap[key])
    console.log(pathToKeyMap[location.pathname])
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
    {
      key: '3',
      icon: <ContainerOutlined />,
      label: 'Dinh Dưỡng',
       onClick: () => handleMenuClick('3')

    },
    {
      key: '4',
      label: 'Thực Đơn',
      icon: <MailOutlined />,
      onClick: () => handleMenuClick('4')
    },
    {
      key: '5',
      label: 'Loại Nguyên Liệu',
      icon: <MailOutlined />,
      onClick: () => handleMenuClick('5')
    }
  ]
  const adminItems: MenuItem[] = [
    {
      key: '6',
      label: 'Doanh thu',
      icon: <AppstoreOutlined />,
      onClick: () => handleMenuClick('5')
    }
  ]
  const nutritionistItems: MenuItem[] = [
    {
      key: '7',
      label: 'Chat',
      icon: <AppstoreOutlined />,
      onClick: () => handleMenuClick('7')
    },
    {
      key: '8',
      label: 'Nguyên liệu ',
      icon: <MailOutlined />,
      onClick: () => handleMenuClick('8') 
    },
    {
      key: '11',
      label: 'Thành Phần Nguyên liệu ',
      icon: <DesktopOutlined />,
      onClick: () => handleMenuClick('11') 
    }
  ]
  const staffItems: MenuItem[] = [
    {
      key: '9',
      label: 'Đơn hàng',
      icon: <AppstoreOutlined />,
      onClick: () => handleMenuClick('9')
    },
    {
      key: '10',
      label: 'Đặt lịch',
      icon: <MailOutlined />,
      onClick: () => handleMenuClick('10')
    }
   
  ]
  let displayedItems: MenuItem[] = []
  let defaultOpenKeys = '1'
  if (userRole === 'Manager') {
    displayedItems = managerItems
  } else if (userRole === 'Admin') {
    displayedItems = adminItems
    defaultOpenKeys = '6'
  } else if (userRole === 'Nutritionist') {
    displayedItems = nutritionistItems
    defaultOpenKeys = '7'
  }else if (userRole === 'Staff') {
    displayedItems = staffItems
    defaultOpenKeys = '9'
  }
  return (
    <div className='sidebar'>
      <Menu
        theme='light'
        mode='inline'
        selectedKeys={[selectedKey]}
        items={displayedItems}
        defaultOpenKeys={[defaultOpenKeys]}
      />
    </div>
  )
}

export default Sidebar
