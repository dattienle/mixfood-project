import { Button, Input, Space, Switch } from 'antd'
import  { useState } from 'react'
// import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'

// import Ingredient from '~/Models/ingredientModel'
import { EditOutlined } from '@ant-design/icons'
// import { approvedIngredient, getIngredients } from '~/api/ingredientApi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// import ModalUpdateIngredient from '~/pages/IngredientTable/modal/modalUpdateIngredient'
import { toast } from 'react-toastify'
import Ingredient from '../../Models/ingredientModel'
import { approvedIngredient, getIngredients } from '../../api/ingredientApi'
import { CommonButton } from '../../UI/button/Button'
import ModalUpdateIngredient from './modal/modalUpdateIngredient'
import ModalAddIngredient from './modal/modalAddIngredient'
// import ModalAddIngredient from '~/pages/IngredientTable/modal/modalAddIngredient'

export default function IngredientNotApprovePage() {
  const queryClient = useQueryClient()
  const [searchText, setSearchText] = useState('')
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  //ts
  const {data: ingredientResponse, refetch, isLoading, isError} = useQuery('ingredient',getIngredients,{
    refetchOnMount: true,
  })
  const ingredients = ingredientResponse?.data.items
  const approvedStatus = useMutation(approvedIngredient, {
    onSuccess: () => {
      queryClient.invalidateQueries('ingredient')
      toast.success('Duyệt nguyên liệu thành công!')
      refetch()
    },
    onError: (error) => {
      console.log('loi', error)
    }
  })
  const handleApproved = (id: number, isApproved: boolean) => {
    approvedStatus.mutate({ id, isApproved })
  }
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
    },
    {
      title: 'Calo',
      dataIndex: 'calo',
      key: 'calo',
      align: 'center',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
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
      render: (imageUrl: string) => <img src={imageUrl} alt="Hình ảnh nguyên liệu" style={{ width: 50, height: 50 }} />,
    },
    {
      title: 'Loại gia vị',
      dataIndex: ['ingredientType', 'name'],
      key: 'ingredientType',
      align: 'center',
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
  ]
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  const filteredData = ingredients?.filter((item: Ingredient) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) && item.isApproved === false
  ) || [];

  const handleAddOk = async () => {
   
    setIsModalAddOpen(false)
   await  refetch()
  }
  const handleUpdateOk = async() =>{
    setIsModalUpdateOpen(false)
    await refetch()
      }
  const handleClose = () => {
    setIsModalUpdateOpen(false)
   setIsModalAddOpen(false)
  }

  return <div style={{ background: 'white', padding: '20px' }}>
    <h1>Quản Lý Nguyên Liệu Chưa Duyệt</h1>
    <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton type='primary' icon={<PlusOutlined />} onClick={ () => { console.log('Button clicked');setIsModalAddOpen(true)}}>
          Thêm Nguyên Liệu
        </CommonButton>
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
      {isModalAddOpen &&(
        <ModalAddIngredient
       isOpen= {isModalAddOpen}
       handleOk={handleAddOk}
       handleCancel={handleClose} 
        />
      )}
  </div>
}
