import { useState } from 'react'
import { Button, Table, Input, Space, Switch, Tooltip, Popover } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { EllipsisOutlined } from '@ant-design/icons'
import { CommonButton } from '../../../UI/button/Button'
import { getAccount, updateStatusAccount } from '../../../api/accountApi'
import { Account } from '../../../Models/accountModel'

export default function AccountPage() {
  const [searchText, setSearchText] = useState('')
  const queryClient = useQueryClient()
  const {
    data: accountsResponse,
    isLoading,
    refetch: refetchAccounts,
    isError
  } = useQuery('accounts', getAccount, { refetchOnMount: true })
  const accounts = accountsResponse?.data.items
  const filteredAccounts = accounts?.filter((account: Account) => account.role.name === 'Customer') || [] 
  console.log(accounts)
  // search
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  const updateStatus = useMutation(updateStatusAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries('accounts')
      toast.success('Cập nhật trạng thái thành công!')

      refetchAccounts()
    },
    onError: (error) => {
      console.log('loi')
    }
  })
  const handleStatusChange = (id: number, isDelete: boolean) => {
    updateStatus.mutate({ id, isDelete })
  }
  const columns: ColumnsType<Account> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center'
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: (role: any) => role.name
    },
    {
      title: 'Chi tiết',
      dataIndex: 'detail',
      key: 'detail',
      align: 'center',
      render: (detail: { name: string; phone: string; address: string }) => (
        <Popover
          content={
            <div>
              <div style={{ fontSize: '16px' }}>
                <strong>Tên:</strong> {detail.name}
              </div>
              <div style={{ fontSize: '16px' }}>
                <strong>Số điện thoại: </strong> {detail.phone}
              </div>
              <div style={{ fontSize: '16px' }}>
                {' '}
                <strong>Địa chỉ: </strong> {detail.address}
              </div>
            </div>
          }
          title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Thông tin chi tiết</span>}
          trigger='hover'
          overlayStyle={{ width: 300 }}
        >
          <Button icon={<EllipsisOutlined />} />
        </Popover>
      )
    },
    {
      title: 'Tdee',
      dataIndex: 'tdee',
      key: 'tdee',
      align: 'center'
    },
    {
      title: 'Mục Tiêu Calo',
      dataIndex: 'targetCalo',
      key: 'targetCalo',
      align: 'center'
    },
    {
      title: 'Calo 1 ngày',
      dataIndex: 'caloriesConsumedToday',
      key: 'caloriesConsumedToday',
      align: 'center'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isDeleted',
      key: 'status',
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

  // const filteredData =
  //   accounts?.filter((item: Account) => item.detail.name.includes(searchText)) || []

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Tài Khoản</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder='Tìm kiếm theo tên' onChange={(e) => handleSearch(e.target.value)} style={{ width: 200 }} />
        <CommonButton type='primary'>Thêm Tài Khoản</CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredAccounts} rowKey={(record) => record.id} />
    </div>
  )
}
