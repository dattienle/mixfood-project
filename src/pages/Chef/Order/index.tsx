import { Button, Collapse, Dropdown, Input, Menu, Modal, Popover, Space, Switch, Tag, Tooltip } from 'antd'
import React, { useState } from 'react'
import { SearchOutlined, PlusOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getOrderChef } from '../../../api/chefApi'
import { CartProduct, OrderChef } from '../../../Models/orderChef'
import { CommonButton } from '../../../UI/button/Button'

export default function ProductPage() {
  const [searchText, setSearchText] = useState('')
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient()
  const [selectedCartProducts, setSelectedCartProducts] = useState<CartProduct[]>([]);
  const { data: orderChefResponse } = useQuery('orderChef', getOrderChef)

  const { Panel } = Collapse;
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
      dataIndex: 'cartProducts',
      key: 'cartProducts',
      align: 'center',
      render: (cartProducts: CartProduct[]) => (
        
  
          <Button onClick={() =>{ setSelectedCartProducts(cartProducts); setVisible(true)}} icon={<EllipsisOutlined />} />
       
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

      <Modal
      title="Thông Tin Chi Tiết"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      style={{ maxHeight: '70vh', overflowY: 'auto' }}

    >
      <Collapse>
        {selectedCartProducts?.map((product, index) => (
         <Panel header={product.dish.name} key={index}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <img
                  src={product.dish.imageUrl}
                  alt={product.dish.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
                <p>
                  <strong>Giá:</strong> {product.price.toLocaleString()} VND
                </p>
                <p>
                  <strong>Số lượng:</strong> {product.quantity}
                </p>
                <p>
                  <strong>Calo:</strong> {product.calo}
                </p>
                <p>
                  <strong>Nguyên liệu:</strong>{' '}
                  {product.ingredient && product.ingredient.length > 0
                    ? product.ingredient.map((ing) => ing.name).join(', ')
                    : 'Không có nguyên liệu'}
                </p>
              </div>
       </Panel>
        ))}
      </Collapse>
    </Modal>
    </div>
  )
}
