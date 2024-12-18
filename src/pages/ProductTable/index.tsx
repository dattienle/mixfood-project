import { Button, Dropdown, Input, Menu, Space, Switch } from 'antd'
import React, { useState } from 'react'
// import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, PlusOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'
// import Ingredient from '~/Models/ingredientModel'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import './style.scss'
import { getDish, updateDishById, updateStatusDish } from '../../api/dishAPI'
import ProductTemplate from '../../Models/productTemplateModel'
import Ingredient from '../../Models/ingredientModel'
import { CommonButton } from '../../UI/button/Button'
import ModalAddProduct from './modal/modalAddDish'
import ModalAddIngredient from './modal/modalAddIngredient'
import ModalPreviewDetail from './modal/modalPreviewDetail'
import ModalUpdateDish from './modal/modalUpdateDish'
import { getPreviewDetails } from '../../api/templateSteps'
import AddIngredientRequest from '../../Models/templateSteps'
import ModalUpdateIngredient from './modal/modalUpdateIngredient'
import { toast } from 'react-toastify'

export default function ProductPage() {
  const [searchText, setSearchText] = useState('')
  const [isAddModalProduct, setIsAddModalProduct] = useState(false)
  const [isEditModalProductOpen, setIsEditModalProductOpen] = useState(false)
  const [isUpdateIngredientModalProductOpen, setIsUpdateIngredientModalProductOpen] = useState(false)
  const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductTemplate | null>(null)
  const [isPreviewDetailModalOpen, setIsPreviewDetailModalOpen] = useState(false)
  const { data: productResponse, refetch: refetchDish } = useQuery('productTemplate', getDish, {
    refetchOnMount: true
  })
  const queryClient = useQueryClient()
  const { mutate: refetchProducts } = useMutation({
    mutationFn: getDish,
    onSuccess: () => {
      queryClient.invalidateQueries('productTemplate')
    }
  })
  const { data: ingredientDetail, refetch: refetchIngre } = useQuery('ingredientDetail', getPreviewDetails, {
    refetchOnMount: true
  })
  const products = productResponse?.data.items || []
  const dishData = ingredientDetail?.data.items || []
  // updateStatus
  const updateStatus = useMutation(updateStatusDish, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
      toast.success('Cập nhật trạng thái thành công!')

      refetchProducts()
    },
    onError: (error) => {
      console.log('loi')
    }
  })
  // status || mutate
  const handleStatusChange = (id: number, isDelete: boolean) => {
    updateStatus.mutate({ id, isDelete })
  }
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
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      render: (category) => category.name
    },
    // {
    //   title: 'Nguyên liệu',
    //   dataIndex: 'description',
    //   key: 'description',
    //   align: 'center',
    //   width: '20%'
    // },
    {
      title: 'Nguyên liệu',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <EyeOutlined
          style={{ color: '#F8B602', fontSize: '25px' }}
          onClick={() => {
            setIsPreviewDetailModalOpen(true)
            setSelectedProduct(record)
          }}
        
        />
      )
    },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      align: 'center',
      render: (_, record) => {
        const hasTemplateStep = dishData?.some((detail: any) => detail.dishId === record.id)
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      setIsEditModalProductOpen(true)
                      setSelectedProduct(record)
                    }}
                  >
                    Chỉnh sửa món ăn
                  </Menu.Item>
                  {!hasTemplateStep ? (
                    <Menu.Item
                      onClick={() => {
                        setIsAddIngredientModalOpen(true)
                        setSelectedProduct(record)
                      }}
                    >
                      Thêm mới nguyên liệu
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      onClick={() => {
                        setIsUpdateIngredientModalProductOpen(true)
                        setSelectedProduct(record)
                      }}
                    >
                      Chỉnh sửa nguyên liệu
                    </Menu.Item>
                  )}
                </Menu>
              </Menu>
            }
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        )
      }
    },

    {
      title: 'Trạng thái',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <Switch
          style={{ backgroundColor: !record.isDeleted ? '' : '#F8B602' }}
          checked={record.isDeleted}
          onChange={() => {
            if (record.id) {
              handleStatusChange(record.id, !record.isDeleted)
            }
          }}
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
    setIsAddIngredientModalOpen(false)
    await refetchIngre()
  }
  const handleUpdateIngreOk = async () => {
    setIsUpdateIngredientModalProductOpen(false)
    await refetchIngre()
  }
  const handleAddOk = async () => {
    setIsAddModalProduct(false)
    await refetchProducts()
    //
  }
  const handleClose = () => {
    setIsAddModalProduct(false)
    setIsAddIngredientModalOpen(false)
    setIsPreviewDetailModalOpen(false)
    setIsEditModalProductOpen(false)
    setIsUpdateIngredientModalProductOpen(false)
  }
  // handleClose
  // handleChange
  const handleUpdateOk = async () => {
    setIsEditModalProductOpen(false)
    await refetchDish()
  }
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
          Thêm món ăn
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} />
      {isAddModalProduct && (
        <ModalAddProduct
          isOpen={isAddModalProduct}
          handleOk={handleAddOk}
          handleCancel={handleClose}

          // handleChange={handleChange}
          // formValues={formValues}
        />
      )}
      {isAddIngredientModalOpen && (
        <ModalAddIngredient
          isOpen={isAddIngredientModalOpen}
          handleOk={handleEditOk}
          handleCancel={handleClose}
          dishId={selectedProduct?.id || NaN}
        />
      )}
      {isPreviewDetailModalOpen && (
        <ModalPreviewDetail
          isOpen={isPreviewDetailModalOpen}
          handleOk={handleEditOk}
          handleCancel={handleClose}
          dishId={selectedProduct?.id || NaN}
        />
      )}
      ,
      {isEditModalProductOpen && (
        <ModalUpdateDish
          isOpen={isEditModalProductOpen}
          handleOk={handleUpdateOk}
          handleCancel={handleClose}
          dishId={selectedProduct?.id || NaN}
        />
      )}
      {isUpdateIngredientModalProductOpen && (
        <ModalUpdateIngredient
          isOpen={isUpdateIngredientModalProductOpen}
          handleOk={handleUpdateIngreOk}
          handleCancel={handleClose}
          dishId={selectedProduct?.id || NaN}
        />
      )}
    </div>
  )
}
