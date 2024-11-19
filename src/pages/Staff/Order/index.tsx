import { Input, Space, Switch, Tag } from 'antd'
import React, { useState } from 'react'
// import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getOrder } from '../../../api/orderAPI'
import { CartProduct, Order } from '../../../Models/order'
import { CommonButton } from '../../../UI/button/Button'
import OrderDetailPage from './modal/modalPreviewDetailOrder'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function OrderPage() {
  const [isPreviewDetailModalOpen, setIsPreviewDetailModalOpen] = useState(false)
  const [isAddModalProduct, setIsAddModalProduct] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<number>()
  const { data: orderResponse } = useQuery('order', getOrder, {
    staleTime: 5000,
    cacheTime: 300000,
    refetchOnMount: true
  })
  const queryClient = useQueryClient()
  const { mutate: refetchProducts } = useMutation({
    mutationFn: getOrder,
    onSuccess: () => {
      queryClient.invalidateQueries('order')
    }
  })
  console.log(orderResponse)
  const orders: Order[] = orderResponse?.data || []
  // const cartProducts: CartProduct[] = orders.flatMap((order) => {
  //   return order.cartProducts.map((cartProduct) => ({
  //     ...cartProduct,
  //     orderStatus: order.status
  //   }))
  // })

  const columns: ColumnType<Order>[] = [
    {
      title: 'Tên',
      dataIndex: 'customerName',
      key: 'name',
      align: 'center'
    },

    {
      title: 'Số lượng',
      dataIndex: 'totalQuantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: 'Món ăn',
      dataIndex: 'cartProducts',
      key: 'name',
      align: 'center',
      render: (cartProducts: CartProduct[]) => (
        <p style={{ margin: '4px 0', fontSize: '12px' }}>
          {cartProducts.map((product) => product.dish.name).join(', ')}
        </p>
      )
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'cartProducts',
      key: 'images',
      align: 'center',
      render: (cartProducts: CartProduct[]) => (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', padding: '8px', maxWidth: '300px' }}>
          {cartProducts.map((product) => (
            <div key={product.id} style={{ flexShrink: 0 }}>
              {product.dish.imageUrl ? (
                <img
                  src={product.dish.imageUrl}
                  alt={product.dish.name || 'Hình ảnh sản phẩm'}
                  style={{ width: 80, height: 80, borderRadius: '8px', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Không có ảnh
                </div>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Giá',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'center',
      render: (totalPrice: number) => `${totalPrice.toLocaleString()} VND`,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Chi Tiết',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <EyeOutlined
          style={{ color: '#F8B602', fontSize: '25px' }}
          onClick={() => {
            setSelectedOrderId(record.id)
            console.log(selectedOrderId)
            setIsPreviewDetailModalOpen(true)
          }}
        />
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
          //No need for a default case, as it is handled initially
        }

        return <Tag color={color}>{statusTag}</Tag>
      }
    }
  ]
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  // const filteredData = cartProducts.filter((item) => item.dish.name.toLowerCase().includes(searchText.toLowerCase()))
  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản lý đơn hàng</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tên'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
      </Space>
      <Table columns={columns} dataSource={orders} />
      {selectedOrderId && isPreviewDetailModalOpen && (
        <OrderDetailPage
          visible={isPreviewDetailModalOpen}
          onClose={() => setIsPreviewDetailModalOpen(false)}
          selectedOrderId={selectedOrderId}
        />
      )}
    </div>
  )
}
