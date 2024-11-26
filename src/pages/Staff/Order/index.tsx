import { Input, Select, Space, Switch, Tag } from 'antd'
import React, { useState } from 'react'
// import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { chooseShipper, getOrder } from '../../../api/orderAPI'
import { CartProduct, Order } from '../../../Models/order'
import { CommonButton } from '../../../UI/button/Button'
import OrderDetailPage from './modal/modalPreviewDetailOrder'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getAccount, getAccountShipper } from '../../../api/accountApi'
import { toast } from 'react-toastify'

export default function OrderPage() {
  const [isPreviewDetailModalOpen, setIsPreviewDetailModalOpen] = useState(false)
  const [isAddModalProduct, setIsAddModalProduct] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<number>()
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined)
  const { data: orderResponse } = useQuery('order', getOrder, {
    staleTime: 5000,
    cacheTime: 300000,
    refetchOnMount: true,
    refetchInterval: 6000
  })
  const queryClient = useQueryClient()
  const { mutate: refetchProducts } = useMutation({
    mutationFn: getOrder,
    onSuccess: () => {
      queryClient.invalidateQueries('order')
    }
  })
  const orders: Order[] = orderResponse?.data || []

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
  }
  const addShipper = useMutation(  ({ orderId, shipperId }: { orderId: number; shipperId: number }) => chooseShipper(orderId, shipperId), {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
      toast.success('Cập nhật trạng thái thành công!')
      refetchProducts()
    },
    onError: (error) => {
      console.log('loi')
    }
  })
  const handleChooseShipper = (shipperId: number, orderId: number) => {
    console.log('Updating shipper for orderId:', orderId, 'with shipperId:', shipperId);
    addShipper.mutate({orderId, shipperId} ); // Gọi API chooseShipper
  }
  const {
    data: accountsResponse,
    isLoading,
    refetch: refetchAccounts,
    isError
  } = useQuery('accounts', getAccountShipper, { refetchOnMount: true })
  const shipper = accountsResponse?.data
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus ? order.status === selectedStatus : true
    const matchesSearchText = order.customerName.toLowerCase().includes(searchText.toLowerCase())
    return matchesStatus && matchesSearchText
  })
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
      title: 'Ngày Đặt Hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      align: 'center',
      render: (orderDate: string) => new Date(orderDate).toLocaleDateString() // Chuyển đổi định dạng ngày
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
          case 'Tìm Shipper':
            statusTag = 'Tìm Shipper'
            color = 'pink' // Or your preferred color
            break
          case 'Giao Shipper':
            statusTag = 'Giao Shipper'
            color = 'orange' // Or your preferred color
            break
          case 'Hoàn Thành':
            statusTag = 'Hoàn Thành'
            color = 'green' // Or your preferred color
            break
        
        }

        return <Tag color={color}>{statusTag}</Tag>
      }
    },
    {
      title: 'Shipper',
      key: 'shipper',
      align: 'center',
      render: (_, record) =>
        record.shipper ? ( // Kiểm tra xem có shipper không
          <span>{record.shipper}</span> // In ra tên shipper
        ) : (
          record.status === 'Đã Chuẩn Bị Xong' && ( // Kiểm tra trạng thái
            <Select
              placeholder='Chọn Shipper'
              onChange={(value) => handleChooseShipper(value, record.id)}
              style={{ width: 150 }}
              allowClear
            >
              {shipper?.map((s: any) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          )
        )
    }
  ]
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  // const filteredData = cartProducts.filter((item) => item.dish.name.toLowerCase().includes(searchText.toLowerCase()))
  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản lý đơn hàng</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        {/* Phần tìm kiếm bên trái */}
        <Space>
          <Input
            placeholder='Tìm kiếm theo tên'
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
        </Space>

        {/* Phần lọc trạng thái bên phải */}
        <Select
          placeholder='Lọc theo trạng thái'
          onChange={handleStatusChange}
          style={{
            width: 200,
            borderRadius: '6px'
          }}
          allowClear
          dropdownStyle={{
            borderRadius: '6px'
          }}
          className='status-filter-select'
        >
          <Select.Option value='Đã Xác Nhận'>Đã Xác Nhận</Select.Option>
          <Select.Option value='Đã Chuẩn Bị Xong'>Đã Chuẩn Bị Xong</Select.Option>
          <Select.Option value='Giao Shipper'>Giao Shipper</Select.Option>
          <Select.Option value='Tìm Shipper'>Tìm Shipper</Select.Option>
          <Select.Option value='Hoàn Thành'>Hoàn Thành</Select.Option>
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredOrders} />
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
