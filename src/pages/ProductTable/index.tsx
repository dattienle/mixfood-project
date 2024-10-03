import { Button, Input, Space, Switch } from 'antd'
import React, { useState } from 'react'
import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'

import Ingredient from '~/Models/ingredientModel'
import { EditOutlined } from '@ant-design/icons'
import { getIngredients } from '~/api/ingredientApi'
import { useQuery } from 'react-query'
import "./style.scss"
import { getProducts } from '~/api/productApi'
import Product from '~/Models/productModel'
export default function ProductPage() {

  const [searchText, setSearchText] = useState('')
  const {data: productResponse, isLoading, isError} = useQuery('product',getProducts)
  const products = productResponse?.data
  const columns: ColumnType<Product>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: number) => `${price.toLocaleString()} VND`,
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['ascend', 'descend'],
    },
   {
    title: 'Số lượng',  
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center',
    sorter: (a, b) => a.quantity - b.quantity,
    sortDirections: ['ascend', 'descend'],
   },
 
    {
      title: 'Thành phần',
      dataIndex: 'ingredients',
      key: 'ingredients',
      align: 'center',
      render: (ingredients: string[]) => ingredients.join(', '),
    },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      align: 'center',
      render: (_, record) => (
        <Button style={{color: '#F8B602', fontSize: '18px'}} icon={<EditOutlined />} 
        // onClick={() => handleEditIngredient(record.id)}
        >
          Chỉnh sửa
        </Button>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <Switch
        style={{ backgroundColor: record.isDeleted ? '' : '#F8B602' }}
          checked={!record.isDeleted}
          // onChange={(checked) => handleUpdateStatus(record.id, checked)}
        />
      ),
    },
  ]
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  const filteredData = products?.filter((item: Ingredient) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  return <div style={{ background: 'white', padding: '20px' }}>
    <h1>Quản Lý Nguyên Liệu Chưa Duyệt</h1>
    <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton type='primary' icon={<PlusOutlined />}>
          Thêm Danh Mục
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} />
  </div>
}
