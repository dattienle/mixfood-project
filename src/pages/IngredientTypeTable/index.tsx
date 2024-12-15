import React, { useState } from 'react'
import { Button, Table, Input, Space, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
// import Category from '~/Models/categoryModel'
// import { CommonButton } from '~/UI/button/Button'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// import { createCategory, getCategories, updateCategory, updateStatusCategory } from '~/api/categoriesAPI'

import { toast } from 'react-toastify'
import IngredientType from '../../Models/ingredientTypeModel'
import { getIngredientType, updateStatusIngredientType } from '../../api/ingredientTypeApi'
import Category from '../../Models/categoryModel'
import { CommonButton } from '../../UI/button/Button'
import ModalAddIngredientType from './modal/modalAdd'
import ModalUpdateIngredientType from './modal/modalUpdate'
import { updateStatusIngredient } from '../../api/ingredientApi'
// import ModalUpdateCategory from '~/pages/CategoryTable/modal/modalUpdate'
// import ModalAddCategory from '~/pages/CategoryTable/modal/modalAdd'
// import { getIngredientType } from '~/api/ingredientTypeApi'
// import ModalAddIngredientType from '~/pages/IngredientTypeTable/modal/modalAdd'
// import IngredientType from '~/Models/ingredientTypeModel'
// import ModalUpdateIngredientType from '~/pages/IngredientTypeTable/modal/modalUpdate'

export default function IngredientTypePage() {
  const [searchText, setSearchText] = useState('')
  const queryClient = useQueryClient()
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [selectedIngredientType, setSelectedIngredientType] = useState<IngredientType | null>(null)

  // call api get categories
  const {
    data: ingredientTypeResponse,
    isLoading,
    refetch,
    isError
  } = useQuery('ingredientType', getIngredientType, { refetchOnMount: true })
  const categories = ingredientTypeResponse?.data.items
  // updateStatus
  const updateStatus = useMutation(updateStatusIngredientType, {
    onSuccess: (response) => {
      queryClient.invalidateQueries('ingredientType')
      toast.success('Cập nhật trạng thái thành công!');
      refetch()
    },
    onError: (error) => {
      console.log('loi')
    }
  })
  // search
  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  // status || mutate
  const handleStatusChange = (id: number, isDelete: boolean) => {
    updateStatus.mutate({ id, isDelete })
    // refetch()
  }

  const handleAddOk = async () => {
   
    setIsModalAddOpen(false)
   await  refetch()
  }
  
  const handleClose = () => {
    setIsModalAddOpen(false)
    setIsModalUpdateOpen(false)
  }
  const handleUpdateOk = async() =>{
    setIsModalUpdateOpen(false)
    await refetch()

      }
  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      align: 'center',
      render: (imageUrl: string) => <img src={imageUrl} alt='Hình ảnh loại nguyên liệu' style={{ width: 50, height: 50 }} />
    },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='link' >
            <EditOutlined style={{ color: '#F8B602', fontSize: '22px' }} onClick={() => { setIsModalUpdateOpen(true); setSelectedIngredientType(record); }} />
          </Button>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isDeleted',
      key: 'status',
      render: (_, record) => (
        <Space>
          <Switch
             style={{ backgroundColor: !record.isDeleted ? '' : '#F8B602' }}
             checked={record.isDeleted}
            onChange={() => {
              if (record.id) {
                handleStatusChange(record.id, !record.isDeleted)
              }
            }}
          />
        </Space>
      ),
      align: 'center'
    }
  ]

  if (isLoading) {
    return <div>Đang tải...</div>
  }
  if (isError) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu</div>
  }

  const filteredData =
    categories?.filter((item: Category) => item.name.toLowerCase().includes(searchText.toLowerCase())) || []

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Loại Nguyên Liệu</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tên'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton onClick={() => setIsModalAddOpen(true)} type='primary' icon={<PlusOutlined />}>
          Thêm Loại Nguyên Liệu
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey={(record) => record.id} />
      {isModalAddOpen && (
        <ModalAddIngredientType
          isOpen={isModalAddOpen}
          handleOk={handleAddOk}
          handleCancel={handleClose}
        />
      )}
      {isModalUpdateOpen && (
        <ModalUpdateIngredientType
          isOpen={isModalUpdateOpen}
          handleOk={handleUpdateOk}
          handleCancel={handleClose}
          ingredientTypeId={selectedIngredientType?.id || NaN}
    
        />
      )}
    </div>
  )
}
