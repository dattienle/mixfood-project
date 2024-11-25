// components/Sidebar.tsx
import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppstoreOutlined,
  PieChartOutlined,
  BookOutlined,
  UserOutlined,
  GoldOutlined,
  AreaChartOutlined,
  ContainerOutlined,
  MailOutlined,
  CalendarOutlined,
  MoneyCollectOutlined,
  BoxPlotOutlined
} from '@ant-design/icons'
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
    '/manager/dashboard/tin-tuc': '14',
    '/manager/dashboard/voucher': '15',
    '/manager/dashboard/package': '16',
    '/manager/dashboard/order': '17',
    '/admin/dashboard/doanh-thu': '6',
    '/nutritionist/dashboard/chat': '7',
    '/nutritionist/dashboard/nguyen-lieu-da-duyet': '8.1',
    '/nutritionist/dashboard/nguyen-lieu-chua-duyet': '8.2',
    '/staff/dashboard/order': '9',
    '/staff/dashboard/calendar': '10',
    '/nutritionist/dashboard/thanh-phan-nguyen-lieu': '11',
    '/admin/dashboard/tai-khoan-khach-hang': '12.1',
    '/admin/dashboard/tai-khoan-nhan-vien': '12.2'
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
      '8.1': '/nutritionist/dashboard/nguyen-lieu-da-duyet',
      '8.2': '/nutritionist/dashboard/nguyen-lieu-chua-duyet',
      '9': '/staff/dashboard/order',
      '10': '/staff/dashboard/calendar',
      '11': '/nutritionist/dashboard/thanh-phan-nguyen-lieu',
      '12.1': '/admin/dashboard/tai-khoan-khach-hang',
      '12.2': '/admin/dashboard/tai-khoan-nhan-vien',
      '13': '/chef/dashboard/order',
      '14': '/manager/dashboard/tin-tuc',
      '15': '/manager/dashboard/voucher',
      '16': '/manager/dashboard/package',
      '17': '/manager/dashboard/order'


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
      label: 'Nguyên liệu ',
      icon: <GoldOutlined />,
      children: [
        { key: '2.1', label: 'Đã phê duyệt ', onClick: () => handleMenuClick('2.1') },
        { key: '2.2', label: 'Chưa phê duyệt', onClick: () => handleMenuClick('2.2') }
      ]
    },
    {
      key: '5',
      label: 'Loại Nguyên Liệu',
      icon: <MailOutlined />,
      onClick: () => handleMenuClick('5')
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
      key: '14',
      label: 'Tin Tức',
      icon: <BookOutlined />,
      onClick: () => handleMenuClick('14')
    },
    {
      key: '15',
      label: 'Mã Giảm Giá',
      icon: <MoneyCollectOutlined />,
      onClick: () => handleMenuClick('15')
    },
    {
      key: '16',
      label: 'Gói',
      icon: <  BoxPlotOutlined
      />,
      onClick: () => handleMenuClick('16')
    },
    {
      key: '17',
      label: 'Đơn hàng',
      icon: <AppstoreOutlined />,
      onClick: () => handleMenuClick('17')
    },
  ]
  const adminItems: MenuItem[] = [
    {
      key: '6',
      label: 'Doanh thu',
      icon: <AreaChartOutlined />,
      onClick: () => handleMenuClick('6')
    },
    {
      key: '12',
      label: 'Tài Khoản',
      icon: <UserOutlined />,
      children: [
        { key: '12.1', label: 'Khách Hàng', onClick: () => handleMenuClick('12.1') },
        { key: '12.2', label: 'Nhân Viên', onClick: () => handleMenuClick('12.2') }
      ]
    }
  ]
  const nutritionistItems: MenuItem[] = [
    {
      key: '7',
      label: 'Chat',
      icon: <CalendarOutlined />,
      onClick: () => handleMenuClick('7')
    },
    {
      key: '8',
      label: 'Nguyên liệu ',
      icon: <GoldOutlined />,
      children: [
        { key: '8.1', label: 'Đã phê duyệt ', onClick: () => handleMenuClick('8.1') },
        { key: '8.2', label: 'Chưa phê duyệt', onClick: () => handleMenuClick('8.2') }
      ]
    },
    {
      key: '11',
      label: 'Thành Phần Nguyên liệu ',
      icon: <ContainerOutlined />,
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
  const chefItems: MenuItem[] = [
    {
      key: '13',
      label: 'Đơn hàng',
      icon: <AppstoreOutlined />,
      onClick: () => handleMenuClick('13')
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
  } else if (userRole === 'Staff') {
    displayedItems = staffItems
    defaultOpenKeys = '9'
  } else if (userRole === 'Chef') {
    displayedItems = chefItems
    defaultOpenKeys = '13'
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
