import { Button, Dropdown, Input, Menu, Space, Switch } from 'antd'
import React, { useState } from 'react'
// import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, PlusOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'
// import Ingredient from '~/Models/ingredientModel'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import './style.scss'
import { getDish } from '../../api/dishAPI'
import ProductTemplate from '../../Models/productTemplateModel'
import Ingredient from '../../Models/ingredientModel'
import { CommonButton } from '../../UI/button/Button'
import ModalAddProduct from './modal/modalAddDish'
import ModalAddIngredient from './modal/modalAddIngredient'
import ModalPreviewDetail from './modal/modalPreviewDetail'
// import Product from '~/Models/productTemplateModel'
// import ModalAddProduct from '~/pages/ProductTable/modal/modalAddDish'
// import { getDish } from '~/api/dishAPI'
// import ModalAddIngredient from '~/pages/ProductTable/modal/modalAddIngredient'
// import ModalPreviewDetail from '~/pages/ProductTable/modal/modalPreviewDetail'
export default function ProductPage() {
  const [searchText, setSearchText] = useState('')
  const [isAddModalProduct, setIsAddModalProduct] = useState(false)
  const [isEditModalProductOpen, setIsEditModalProductOpen] = useState(false)
  const [isEditIngredientsModalOpen, setIsEditIngredientsModalOpen] = useState(false)
  const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductTemplate | null>(null)
  const [isPreviewDetailModalOpen, setIsPreviewDetailModalOpen] = useState(false)
  const { data: productResponse } = useQuery('productTemplate', getDish)
  const queryClient = useQueryClient()
  const { mutate: refetchProducts } = useMutation({
    mutationFn: getDish,
    onSuccess: () => {
      queryClient.invalidateQueries('productTemplate')
    }
  })

  const products = productResponse?.data.items || []

  const columns: ColumnType<ProductTemplate>[] = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'image',
      align: 'center',
      render: (imageUrl: string) => <img src={imageUrl} alt='Hình ảnh sản phẩm' style={{ width: 100, height: 100 }} />
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: number) => `${price.toLocaleString()} VND`,
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['ascend', 'descend']
    },

    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'category',
      align: 'center',
      
    },
    // {
    //   title: 'Nguyên liệu',
    //   dataIndex: 'description',
    //   key: 'description',
    //   align: 'center',
    //   width: '20%'
    // },
    {
      title: 'Trạng thái',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <EyeOutlined
          style={{ color: '#F8B602', fontSize: '25px'  }}
          checked={!record.isDeleted}
          onClick={() => {setIsPreviewDetailModalOpen(true); setSelectedProduct(record);}}
          // onChange={(checked) => handleUpdateStatus(record.id, checked)}
        />
      )
    },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      align: 'center',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => { setIsEditModalProductOpen(true); setSelectedProduct(record); }}>Chỉnh sửa món ăn</Menu.Item>
              <Menu.Item onClick={() => { setIsEditIngredientsModalOpen(true); setSelectedProduct(record); }}>Chỉnh sửa nguyên liệu</Menu.Item>
              <Menu.Item onClick={() => { setIsAddIngredientModalOpen(true); setSelectedProduct(record); }}>Thêm mới nguyên liệu</Menu.Item>
            </Menu>
          }
        >
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      )
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
      )
    }
  ]
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  const filteredData =
    products?.filter((item: Ingredient) => item.name.toLowerCase().includes(searchText.toLowerCase())) || []

  const handleEditOk = async () => {
    setIsAddModalProduct(false)
   await  refetchProducts()
  }

  const handleClose = () => {
    setIsAddModalProduct(false)
    setIsAddIngredientModalOpen(false)
    setIsPreviewDetailModalOpen(false)
  }
  // handleClose
  // handleChange
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
        <CommonButton type='primary' onClick={() => setIsAddModalProduct(true)} icon={<PlusOutlined />}>
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
      {
        isAddIngredientModalOpen && (
          <ModalAddIngredient
            isOpen = {isAddIngredientModalOpen}
            handleOk={handleEditOk}
            handleCancel={handleClose}
            dishId={selectedProduct?.id || NaN} 
          />
     ) }
     {
      isPreviewDetailModalOpen && (
        <ModalPreviewDetail
        isOpen ={isPreviewDetailModalOpen}
        handleOk={handleEditOk}
        handleCancel={handleClose} 
        dishId={selectedProduct?.id || NaN} 
        />
      )
     }

    </div>
  )
}
