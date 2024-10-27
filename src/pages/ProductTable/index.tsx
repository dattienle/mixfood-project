import { Button, Input, Space, Switch } from 'antd'
import React, { useState } from 'react'
import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'

import Ingredient from '~/Models/ingredientModel'
import { EditOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'
import "./style.scss"
import {  getProductTemplate } from '~/api/productTemplateApi'
import Product from '~/Models/productTemplateModel'
import Category from '~/Models/categoryModel'
import ModalAddProduct from '~/pages/ProductTable/modal/modalAdd'
export default function ProductPage() {

  const [searchText, setSearchText] = useState('')
  const [isAddModalProduct, setIsAddModalProduct] = useState(false)
  const {data: productResponse, isLoading, isError} = useQuery('productTemplate',getProductTemplate)
  const products = productResponse?.data
  const columns: ColumnType<Product>[] = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'image',
      align: 'center',
      render: (imageUrl: string) => <img src={imageUrl} alt="Hình ảnh sản phẩm" style={{ width: 100, height: 100 }} />,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
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
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
    width: '20%',
   },
 
   
    
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      render: (category: Category) => category.name,
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

  const handleEditOk  = () =>{
    setIsAddModalProduct(false)
  }

  const handleClose = () =>{
    setIsAddModalProduct(false)
  }
  // handleClose
  // handleChange
  return <div style={{ background: 'white', padding: '20px' }}>
    <h1>Quản Lý Thực Đơn</h1>
    <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton type='primary'  onClick={() => setIsAddModalProduct(true)} icon={<PlusOutlined />}>
          Thêm Danh Mục
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} />
      {isAddModalProduct && (
        <ModalAddProduct
          isOpen={isAddModalProduct}
          handleOk={handleEditOk}
          handleCancel={handleClose}
          // handleChange={handleChange}
          // formValues={formValues}
        />
      )}
  </div>
}
