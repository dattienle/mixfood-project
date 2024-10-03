import { Button, Input, Space, Switch } from 'antd'
import React, { useState } from 'react'
import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'
import IngredientType from '~/Models/ingredientTypeModel'
import Ingredient from '~/Models/ingredientModel'
import { EditOutlined } from '@ant-design/icons'
import { getIngredients } from '~/api/ingredientApi'
import { useQuery } from 'react-query'
export default function IngredientApprovePage() {

  const [searchText, setSearchText] = useState('')
  const {data: ingredientResponse, isLoading, isError} = useQuery('ingredient',getIngredients)
  const ingredients = ingredientResponse?.data
  const columns: ColumnType<Ingredient>[] = [
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
      title: 'Calo',
      dataIndex: 'calo',
      key: 'calo',
      align: 'center',
      sorter: (a, b) => a.calo - b.calo,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      align: 'center',
      render: (imageUrl: string) => <img src={imageUrl} alt="Hình ảnh nguyên liệu" style={{ width: 50, height: 50 }} />,
    },
    {
      title: 'Loại gia vị',
      dataIndex: ['ingredientType', 'name'],
      key: 'ingredientType',
      align: 'center',
      sorter: (a, b) => a.ingredientType.name.localeCompare(b.ingredientType.name),
      sortDirections: ['ascend', 'descend'],
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
  const filteredData = ingredients?.filter((item: Ingredient) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) && item.isDeleted === false
  ) || [];

  return <div style={{ background: 'white', padding: '20px' }}>
    <h1>Quản Lý Nguyên Liệu</h1>
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
