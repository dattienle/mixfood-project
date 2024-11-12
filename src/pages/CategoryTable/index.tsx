import  { useState } from 'react'
import { Button, Table, Input, Space, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
// import Category from '~/Models/categoryModel'
// import { CommonButton } from '~/UI/button/Button'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// import { createCategory, getCategories, updateCategory, updateStatusCategory } from '~/api/categoriesAPI'

import { toast } from 'react-toastify'
// import ModalUpdateCategory from '~/pages/CategoryTable/modal/modalUpdate'
// import ModalAddCategory from '~/pages/CategoryTable/modal/modalAdd'
import Category from '../../Models/categoryModel'
import { CommonButton } from '../../UI/button/Button'
import { createCategory, getCategories, updateCategory, updateStatusCategory } from '../../api/categoriesAPI'
import ModalUpdateCategory from './modal/modalUpdate'
import ModalAddCategory from './modal/modalAdd'

export default function CategoryPage() {
  const [searchText, setSearchText] = useState('')
  // const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [formValues, setFormValues] = useState<Category>({ id: 0, name: '', isDeleted: false })

  // call api get categories
  const {
    data: categoriesResponse,
    isLoading,
    refetch: refetchCategories,
    isError
  } = useQuery('categories', getCategories)
  const categories = categoriesResponse?.data.items
  // updateStatus
  const updateStatus = useMutation(updateStatusCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
      toast.success('Cập nhật trạng thái thành công!');

      refetchCategories()
    },
    onError: (error) => {
      console.log('loi')
    }
  })
// chỉnh sửa tên
  const editCategory = useMutation(
    (category: { id: number; name: string }) => updateCategory(category.id, category.name),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories')
        refetchCategories()
        handleClose()
      },
      onError: (error) => {
        console.log('loi update')
      }
    }
  )
//  Thêm mới danh mục
  const addCategory = useMutation(
    (body: Category) => createCategory(body), {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
      refetchCategories()
      handleClose()
    }
  })
  // search
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  // add category || mutate
  const handleAddOk = () =>{
    addCategory.mutate(formValues)
  }
  // status || mutate
  const handleStatusChange = (id: number, isDelete: boolean) => {
    updateStatus.mutate({ id, isDelete })
  }
  // edit category || mutate
  const handleEditOk = () => {
    const requestData = {
      name: formValues.name
    }
    editCategory.mutate({ id: formValues.id, name: requestData.name })
  }
  const handleEditCategory = (record: Category) => {
    setFormValues(record)
    setIsModalUpdateOpen(true)
    console.log(isModalUpdateOpen)
  }
  const handleChange = (value: string, key: keyof Category) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }
  const handleClose = () => {
    setIsModalUpdateOpen(false)
    setIsModalAddOpen(false)
    setFormValues({ id: 0, name: '', isDeleted: false })
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
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => handleEditCategory(record)}>
            <EditOutlined style={{ color: '#F8B602', fontSize: '22px' }} />
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
            style={{ backgroundColor: record.isDeleted ? '' : '#F8B602' }}
            checked={!record.isDeleted}
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
      <h1>Quản Lý Danh Mục</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tên'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton onClick={() => setIsModalAddOpen(true)} type='primary' icon={<PlusOutlined />}>
          Thêm Danh Mục
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey={(record) => record.id} />
      {isModalUpdateOpen && (
        <ModalUpdateCategory
          isOpen={isModalUpdateOpen}
          handleOk={handleEditOk}
          handleCancel={handleClose}
          handleChange={handleChange}
          formValues={formValues}
        />
      )}
      {isModalAddOpen && (
        <ModalAddCategory
          isOpen={isModalAddOpen}
          handleOk={handleAddOk}
          handleCancel={handleClose}
          handleChange={handleChange}
          formValues={formValues}
        />
      )}
    </div>
  )
}
