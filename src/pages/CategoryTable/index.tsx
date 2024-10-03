import React, { useState, useEffect } from 'react'
import { Button, Table, Input, Space, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined, PlusOutlined,EditOutlined } from '@ant-design/icons'
import Category from '~/Models/categoryModel'
import { CommonButton } from '~/UI/button/Button'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getCategories, updateStatusCategory } from '~/api/categoriesAPI'
import Modal from 'antd/es/modal/Modal'
import { Module } from 'module'


export default function CategoryPage() {
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  // call api get categories
  const {data: categoriesResponse, isLoading, isError} = useQuery('categories',getCategories)
  const categories = categoriesResponse?.data


  const updateStatusMutation = useMutation(updateStatusCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
    },
    onError: (error) => {
      console.error('Cập nhật trạng thái thất bại:', error);
    },
  })

  // search
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  // add category
  const handleAddCategory = () => {
    setIsModalOpen(true)
  }
  // edit category
  const handleEditCategory = (id: number) => {
    setIsModalEditOpen(true)
  }
  const columns: ColumnsType<Category> = [
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
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
    render: (_, record) => (
      <Space>
        <Button
          type="link"
      onClick={() => handleEditCategory(record.id)} 
        >
         <EditOutlined style={{color: '#F8B602', fontSize: '22px'}}/> 
       
        </Button>
      </Space>
    ),
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
            onClick={() => {
          
              updateStatusMutation.mutate(record.id)
            }}
          />       
          </Space>
      ),
      align: 'center',
    },
  ];

  useEffect(() => {
    console.log('Categories updated:', categoriesResponse);
  }, [categoriesResponse]);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }
  if (isError) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu</div>;
  }

  const filteredData = categories?.filter((item: Category) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Danh Mục</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton onClick={handleAddCategory} type='primary' icon={<PlusOutlined />}>
          Thêm Danh Mục
        </CommonButton>
      </Space>
      <Modal title='Thêm danh mục' style={{}}  open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <Input placeholder='Nhập tên danh mục' />
      </Modal>
      <Modal title='Chỉnh sửa danh mục' style={{}}  open={isModalEditOpen} onCancel={() => setIsModalEditOpen(false)}>
        <Input placeholder='Nhập tên danh mục' value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
      </Modal>
    
      <Table columns={columns} dataSource={filteredData} rowKey={(record) => record.id} />
    </div>
  )
}
