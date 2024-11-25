import { Button, Input, Space, Switch } from 'antd'
import React, { useState } from 'react'
// import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'
// import IngredientType from '~/Models/ingredientTypeModel'
// import Ingredient from '~/Models/ingredientModel'
import { EditOutlined } from '@ant-design/icons'
// import { approvedIngredient, getIngredients, updateStatusIngredient } from '~/api/ingredientApi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { approvedIngredient, getIngredients, updateStatusIngredient } from '../../api/ingredientApi'
import Ingredient from '../../Models/ingredientModel'
import ModalUpdateIngredient from './modal/modalUpdateIngredient'
export default function IngredientApproveNutritionistPage() {
  const queryClient = useQueryClient()
  const [searchText, setSearchText] = useState('')
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const {
    data: ingredientResponse,
    refetch: refetchIngredient,
    isLoading,
    isError
  } = useQuery('ingredient', getIngredients, { refetchOnMount: true })
  const ingredients = ingredientResponse?.data.items
  const updateStatus = useMutation(updateStatusIngredient, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
      toast.success('Cập nhật trạng thái thành công!')

      refetchIngredient()
    },
    onError: (error) => {
      console.log('loi')
    }
  })
  const approvedStatus = useMutation(approvedIngredient, {
    onSuccess: () => {
      queryClient.invalidateQueries('ingredient')
      toast.success('Duyệt nguyên liệu thành công!')

      refetchIngredient()
    },
    onError: (error) => {
      console.log('loi')
    }
  })
  const handleApproved = (id: number, isApproved: boolean) => {
    approvedStatus.mutate({ id, isApproved })
  }
  const handleStatusChange = (id: number, isDelete: boolean) => {
    updateStatus.mutate({ id, isDelete })
  }
  const handleUpdateOk = async() =>{
    setIsModalUpdateOpen(false)
    await refetchIngredient()
      }
  const handleClose = () => {
    setIsModalUpdateOpen(false)

  }

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
      render: (price: number) => `${price.toLocaleString()} VND`,
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Calo',
      dataIndex: 'calo',
      key: 'calo',
      align: 'center',
      sorter: (a, b) => a.calo - b.calo,
      sortDirections: ['ascend', 'descend']
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
      align: 'center',
      sorter: (a, b) => a.ingredientType.name.localeCompare(b.ingredientType.name),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Phê Duyệt',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <Switch
        style={{ backgroundColor: record.isApproved ? '#F8B602' : '' }}
          checked={record.isApproved}
          onChange={() => {
            if (record.id) {
              handleApproved(record.id, !record.isApproved)
            }
          }}
        />
      ),
    },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='link' >
            <EditOutlined style={{ color: '#F8B602', fontSize: '22px' }} onClick={() => { setIsModalUpdateOpen(true); setSelectedIngredient(record); }} />
          </Button>
        </Space>
      )
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
    ingredients?.filter(
      (item: Ingredient) => item.name.toLowerCase().includes(searchText.toLowerCase()) && item.isApproved === true
    ) || []

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Nguyên Liệu</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tên'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
      </Space>
      <Table columns={columns} dataSource={filteredData} />
      {isModalUpdateOpen &&(
        <ModalUpdateIngredient
        isOpen={isModalUpdateOpen}
          handleOk={handleUpdateOk}
          handleCancel={handleClose}
          ingredientId={selectedIngredient?.id || NaN}

        />
      )}
    </div>
  )
}
