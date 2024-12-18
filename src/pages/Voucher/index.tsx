import { useState } from 'react'
import { Button, Table, Input, Space, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import Category from '../../Models/categoryModel'
import { CommonButton } from '../../UI/button/Button'
import { getCategories, updateStatusCategory } from '../../api/categoriesAPI'
import Voucher from '../../Models/voucher'
import { getVoucher, updateStatusVoucher } from '../../api/voucherApi'
import ModalAddVoucher from './modal/modalAdd'
import ModalUpdateVoucher from './modal/modalUpdate'


export default function VoucherPage() {
  const [searchText, setSearchText] = useState('')
  // const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const {
    data: voucherResponse,
    isLoading,
    refetch,
    isError
  } = useQuery('voucher', getVoucher, { refetchOnMount: true })
  const voucher = voucherResponse?.data.items
  // updateStatus
  const updateStatus = useMutation(updateStatusVoucher, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories')
      toast.success('Cập nhật trạng thái thành công!')

      refetch()
    },
    onError: (error) => {
      console.log('loi')
    }
  })
  // chỉnh sửa tên

  // search
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  // add category || mutate
  const handleAddOk = async () => {
    setIsModalAddOpen(false)
    await refetch()
  }
  // status || mutate
  const handleStatusChange = (id: number, isDelete: boolean) => {
    updateStatus.mutate({ id, isDelete })
  }
  const handleEditOk = async () => {
    setIsModalUpdateOpen(false)
    await refetch()
  }

  const handleClose = () => {
    setIsModalUpdateOpen(false)
    setIsModalAddOpen(false)
  }

  const columns: ColumnsType<Voucher> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      align: 'center'
    },
    {
      title: 'Số Tiền',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      align: 'center'
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      align: 'center',
      render: (expirationDate: string) => new Date(expirationDate).toLocaleDateString()
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type='link'
            onClick={() => {
              setIsModalUpdateOpen(true)
              setSelectedVoucher(record)
            }}
          >
            <EditOutlined style={{ color: '#F8B602', fontSize: '22px' }} />
          </Button>
        </Space>
      )
    },
    {
      title: 'Kích hoạt',
      dataIndex: 'isActived',
      key: 'status',
      render: (_, record) => (
        <Space>
          <Switch
            style={{ backgroundColor: !record.isActive ? '' : '#F8B602' }}
            checked={record.isActive}
            onChange={() => {
              if (record.id) {
                handleStatusChange(record.id, !record.isActive)
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
  voucher?.filter((item: Voucher) => item.code.toLowerCase().includes(searchText.toLowerCase())) || []

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Mã Giảm Giá</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo mã'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton onClick={() => setIsModalAddOpen(true)} type='primary' icon={<PlusOutlined />}>
          Thêm Mã Giảm Giá
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey={(record) => record.id} />
      {isModalUpdateOpen && (
        <ModalUpdateVoucher
          isOpen={isModalUpdateOpen}
          handleOk={handleEditOk}
          handleCancel={handleClose}
          voucherId={selectedVoucher?.id || NaN}
        />
      )}
      {isModalAddOpen && <ModalAddVoucher isOpen={isModalAddOpen} handleOk={handleAddOk} handleCancel={handleClose} />}
    </div>
  )
}
