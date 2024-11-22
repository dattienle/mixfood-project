import { Button, Collapse, Dropdown, Input, Menu, Modal, Popover, Space, Switch, Tag, Tooltip } from 'antd'
import React, { useState } from 'react'
import { SearchOutlined, PlusOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getOrderChef } from '../../../api/chefApi'
import {  OrderChef } from '../../../Models/orderChef'

import OrderDetailChefPage from './modal/orderChefDetail'

export default function ProductPage() {
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient()
  const [selectedCartProductsId, setSelectedCartProductsId] = useState<number>();
  const { data: orderChefResponse } = useQuery('orderChef', getOrderChef)

console.log(orderChefResponse?.data)
  const columns: ColumnType<OrderChef>[] = [
    {
      title: 'Tên Khách Hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      align: 'center'
    },
    {
      title: 'Số lượng',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      align: 'center'
    },
    {
      title: 'Giá',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'center',
      render: (price: number) => `${price.toLocaleString()} VND`,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center'
    },
    {
      title: 'Ngày Đặt Hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      align: 'center',
      render: (orderDate: string) => new Date(orderDate).toLocaleDateString() // Chuyển đổi định dạng ngày
    },

    {
      title: 'Chi tiết',
   
      key: 'detail',
      align: 'center',
      render: (_, record) => (
        
  
          <Button onClick={() =>{ setSelectedCartProductsId(record.id); setVisible(true)}} icon={<EllipsisOutlined />} />
       
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      align: 'center',

      render: (_, record) => {
        let statusTag: string | React.ReactNode = 'Unknown' // Default to "Unknown"
        let color = 'gray'

        switch (record.status) {
          case 'Đã Xác Nhận':
            statusTag = 'Đã Xác Nhận'
            color = 'blue' // Or your preferred color
            break
          case 'Đã Chuẩn Bị Xong':
            statusTag = 'Đã Chuẩn Bị Xong'
            color = 'gold' // Or your preferred color
            break
          case 'Đã Giao Shipper':
            statusTag = 'Đã Giao Shipper'
            color = 'orange' // Or your preferred color
            break
          case 'Hoàn Thành':
            statusTag = 'Hoàn Thành'
            color = 'green' // Or your preferred color
            break
        }

        return <Tag color={color}>{statusTag}</Tag>
      }
    }
  ]
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  const filteredData = orderChefResponse?.data || []



  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Thực Đơn</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tên'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
      </Space>
      <Table columns={columns} dataSource={filteredData} />
    <OrderDetailChefPage
     visible={visible}
     onClose={() => setVisible(false)}
     selectedOrderId={selectedCartProductsId || NaN}
    />
    
    </div>
  )
}
