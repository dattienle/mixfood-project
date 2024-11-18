

import { useState } from 'react'
import { Button, Table, Input, Space, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
// import { CommonButton } from '~/UI/button/Button'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import Nutrition from '../../Models/nutritionModel'
import { getNutrition, updateStatusNutrition } from '../../api/nutritionApi'
import { CommonButton } from '../../UI/button/Button'
import ModalAddProduct from './modal/modalAddNutrition'
import ModalUpdateNutrition from './modal/modalUpdateNutrition'
// import { getNutrition, updateStatusNutrition } from '~/api/nutritionApi'
// import Nutrition from '~/Models/nutritionModel'
// import ModalAddProduct from '~/pages/NutritionTable/modal/modalAddNutrition'
// import ModalUpdateNutrition from '~/pages/NutritionTable/modal/modalUpdateNutrition'

export default function NutritionApprovePage() {
  const [searchText, setSearchText] = useState('')
  const queryClient = useQueryClient()
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [selectedNutrition, setSelectedNutrition] = useState<Nutrition | null>(null)
  const {
    data: nutritions,
    isLoading,
    refetch: refetchNutritions,
    isError
  } = useQuery('nutritions', getNutrition,{refetchOnMount: true,})
  const nutritionItems = nutritions?.data.items || [];
  // updateStatus
  const updateStatus = useMutation(updateStatusNutrition, {
    onSuccess: () => {
      queryClient.invalidateQueries('nutritions')
      toast.success('Cập nhật trạng thái thành công!');
    },
    onError: (error) => {
      console.log('loi', error)
    }
  })
  const handleStatusChange = (id: number, isDelete: boolean) => {
    updateStatus.mutate({ id, isDelete })
  }
  // search
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  const handleAddOk = async () => {
    setIsModalAddOpen(false)
    setIsModalUpdateOpen(false)
   await  refetchNutritions()
  }
  
  const handleClose = () => {
    setIsModalAddOpen(false)
   setIsModalUpdateOpen(false)
  }

  const columns: ColumnsType<Nutrition> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'Tên',
      dataIndex: 'ingredient',
      key: 'ingredient',
      align: 'center',
      render: (ingredient) => ingredient?.name
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'image',
      align: 'center',
      render: (imageUrl: string) => <img src={imageUrl} alt='Hình ảnh sản phẩm' style={{ width: 100, height: 100 }} />
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: 'Vitamin',
      dataIndex: 'vitamin',
      key: 'vitamin',
      align: 'center',
    },
    {
      title: 'Giá trị sức khỏe',
      dataIndex: 'healthValue',
      key: 'healthValue',
      align: 'center',
    },
    {
      title: 'Nutrilite',
      dataIndex: 'nutrilite',
      key: 'nutrilite',
      align: 'center',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type='link' >
            <EditOutlined style={{ color: '#F8B602', fontSize: '22px' }} onClick={() => { setIsModalUpdateOpen(true); setSelectedNutrition(record); }} />
          </Button>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isDeleted',
      key: 'isDeleted', // Change key to 'isDeleted'
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
    nutritionItems?.filter((item: Nutrition) => item.ingredient.name.toLowerCase().includes(searchText.toLowerCase())) || []

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Dinh Dưỡng</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tên'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton onClick={() => setIsModalAddOpen(true)} type='primary' icon={<PlusOutlined />}>
          Thêm Dinh Dưỡng
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey={(record) => record.id} />
      
      {isModalAddOpen && (
        <ModalAddProduct
          isOpen={isModalAddOpen}
          handleOk={handleAddOk}
          handleCancel={handleClose}
  
        />
      )}
      {isModalUpdateOpen &&(
        <ModalUpdateNutrition
        isOpen={isModalUpdateOpen}
          handleOk={handleAddOk}
          handleCancel={handleClose}
          nutritionId={selectedNutrition?.id || NaN}
        />
      )}
    </div>
  )
}
