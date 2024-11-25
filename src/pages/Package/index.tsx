import React, { useState } from 'react'
import { Button, Table, Input, Space, Switch, Popover } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined, PlusOutlined, EditOutlined,EllipsisOutlined } from '@ant-design/icons'
// import Category from '~/Models/categoryModel'
// import { CommonButton } from '~/UI/button/Button'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// import { createCategory, getCategories, updateCategory, updateStatusCategory } from '~/api/categoriesAPI'

import { toast } from 'react-toastify'
import IngredientType from '../../Models/ingredientTypeModel'
import { getIngredientType, updateStatusIngredientType } from '../../api/ingredientTypeApi'
import Category from '../../Models/categoryModel'
import { CommonButton } from '../../UI/button/Button'
import { getPackage } from '../../api/packageApi'
import { Package } from '../../Models/packageModel'
import ModalAddPackage from './modal/modalAdd'
import ModalUpdatePackage from './modal/modalUpdate'

export default function PackagePage() {
  const [searchText, setSearchText] = useState('')
  const queryClient = useQueryClient()
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

  // call api get package
  const {
    data: packageResponse,
    isLoading,
    refetch,
    isError
  } = useQuery('package', getPackage, { refetchOnMount: true })
  const packages = packageResponse?.data.items
  
  // search
  const handleSearch = (value: string) => {
    setSearchText(value)
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
  const columns: ColumnsType<Package> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'Tiêu Đề',
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      align: 'center'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      align: 'center'
    },
    {
      title: 'Chi Tiết Gói', // Thêm cột SubPackage
      key: 'subPackage',
      align: 'center',
      render: (_, record) => (
        <Popover
          content={
            <div>
              {record.subPackage?.map((sub: { id: number; name: string }) => (
                <div key={sub.id}>{sub.name}</div>
              ))}
            </div>
          }
          title="Danh sách chi tiết gói"
          trigger="hover"
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Popover>
      )
    },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='link' >
            <EditOutlined style={{ color: '#F8B602', fontSize: '22px' }} onClick={() => { setIsModalUpdateOpen(true); setSelectedPackage(record); }} />
          </Button>
        </Space>
      )
    },
  ]

  if (isLoading) {
    return <div>Đang tải...</div>
  }
  if (isError) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu</div>
  }

  const filteredData =
  packages?.filter((item: Package) => item.title.toLowerCase().includes(searchText.toLowerCase())) || []

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Gói</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tiêu đề'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton onClick={() => setIsModalAddOpen(true)} type='primary' icon={<PlusOutlined />}>
          Thêm Gói 
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey={(record) => record.id} />
      {isModalAddOpen && (
        <ModalAddPackage
          isOpen={isModalAddOpen}
          handleOk={handleAddOk}
          handleCancel={handleClose}
        />
      )}
      {isModalUpdateOpen && (
        <ModalUpdatePackage
          isOpen={isModalUpdateOpen}
          handleOk={handleUpdateOk}
          handleCancel={handleClose}
          packageId={selectedPackage?.id || NaN}
    
        />
      )}
    </div>
  )
}
