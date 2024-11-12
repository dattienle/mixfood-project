import { Button, Input, Space, Switch } from 'antd'
import React, { useState } from 'react'
import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'

import Ingredient from '~/Models/ingredientModel'
import { EditOutlined } from '@ant-design/icons'
import { getIngredients, updateIngredientById } from '~/api/ingredientApi'
import { QueryClient, useQuery, useQueryClient } from 'react-query'
import ModalAddCalo from '~/pages/IngredientNutritionist/modal/modalAdd'
import { toast } from 'react-toastify'
export default function IngredientForNutritionist() {
  const [searchText, setSearchText] = useState('')
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const { data: ingredientResponse, isLoading, isError } = useQuery('ingredient', getIngredients)
  const queryClient = useQueryClient()
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const ingredients = ingredientResponse?.data.items
  const columns: ColumnType<Ingredient>[] = [
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
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: number) => `${price.toLocaleString()} VND`
    },
    {
      title: 'Calo',
      dataIndex: 'calo',
      key: 'calo',
      align: 'center'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: 'Link',
      dataIndex: 'urlInfo',
      key: 'urlInfo',
      align: 'center'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      align: 'center',
      render: (imageUrl: string) => <img src={imageUrl} alt='Hình ảnh nguyên liệu' style={{ width: 50, height: 50 }} />
    },
    {
      title: 'Loại gia vị',
      dataIndex: ['ingredientType', 'name'],
      key: 'ingredientType',
      align: 'center'
    },
    {
      title: 'Thao tác',
      key: 'edit',
      align: 'center',
      render: (_, record) => (
        <Button
          style={{ color: '#F8B602', fontSize: '18px' }}
          icon={<PlusOutlined />}
          onClick={() => handleEditIngredient(record)}
        >
          Thêm Calo
        </Button>
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
    ingredients?.filter(
      (item: Ingredient) => item.name.toLowerCase().includes(searchText.toLowerCase()) && item.isApproved === false
    ) || []

  const handleEditIngredient = (record: Ingredient) => {
    setSelectedIngredient(record)
    setIsModalAddOpen(true)
  }

  const handleAddOk = (updatedIngredient: Ingredient) => {
    const formData = new FormData()
    formData.append('calo', updatedIngredient.calo.toString())
    // for (const pair of formData.entries()) {
    //   console.log(pair[0]+ ', '+ pair[1]); 
    // }
    // console.log(formData.get('calo'));
    updateIngredientById({ id: updatedIngredient.id, data: formData })
      .then(() => {
        queryClient.invalidateQueries('ingredient')
        toast.success('Thêm calo thành công')
        setIsModalAddOpen(false)
        setSelectedIngredient(null)
      })
      .catch((error) => {
        toast.error('Thêm calo thất bại')
        console.error('Lỗi khi cập nhật nguyên liệu:', error)
      })
  }

  const handleClose = () => {
    setIsModalAddOpen(false)
    setSelectedIngredient(null)
  }

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Nguyên Liệu Cần Thêm Calo</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tên'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
      </Space>
      <Table columns={columns} dataSource={filteredData} />
      {isModalAddOpen && selectedIngredient && (
        <ModalAddCalo
          isOpen={isModalAddOpen}
          ingredient={selectedIngredient}
          handleOk={handleAddOk}
          handleCancel={handleClose}
        />
      )}
    </div>
  )
}
