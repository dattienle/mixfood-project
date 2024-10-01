import React, { useState } from 'react'
import { Button, Table, Input, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import Category from '~/Models/categoryModel'
import { CommonButton } from '~/UI/button/Button'
import { useQuery } from 'react-query'
import { getCategories } from '~/api/categoriesAPI'


export default function CategoryPage() {
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  const {data: categoriesResponse, isLoading, isError} = useQuery('categories',getCategories)
  const categories = categoriesResponse?.data
console.log(categories)
  const handleSearch = (value: string) => {
    setSearchText(value)
  }


  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/categories/edit/${record.id}`)}>Sửa</Button>
          <Button danger>Xóa</Button>
        </Space>
      ),
    },
  ];

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
        <CommonButton type='primary' icon={<PlusOutlined />}>
          Thêm Danh Mục
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  )
}
