import { useState } from 'react'
import { Button, Table, Input, Space, Switch, Tooltip, Popover, Modal, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { EllipsisOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { CommonButton } from '../../../UI/button/Button'
import { getAccount, updateStatusAccount } from '../../../api/accountApi'
import { Account } from '../../../Models/accountModel'
import ModalAddAccount from './modal/modalAdd'
import CertificateModal from './modal/modalPreviewNutri'

export default function StaffPage() {
  const [searchText, setSearchText] = useState('')
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)

  const queryClient = useQueryClient()
  const {
    data: accountsResponse,
    isLoading,
    refetch: refetchAccounts,
    isError
  } = useQuery('accounts', getAccount, { refetchOnMount: true })
  const accounts = accountsResponse?.data.items
  const filteredAccounts = accounts?.filter((account: Account) => account.role.name !== 'Customer') || []

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
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

  const handleAddOk = async () => {
    setIsModalAddOpen(false)
    await refetchAccounts()
  }
  const handleClose = () => {
    setIsModalAddOpen(false)
  }
  // 

  const openModal = (id: number) => {
    setSelectedId(id); // Lưu ID của tài khoản
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };
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
      title: 'Xem chứng chỉ',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: (_, record) => {
        console.log('record:', record)
        return record.role?.name === 'Nutritionist' ? (
          <Tooltip title='Xem chứng chỉ'>
            <InfoCircleOutlined
              style={{ fontSize: '18px', color: '#1890ff', cursor: 'pointer' }}
              onClick={() => openModal(record.id)}
            />
          </Tooltip>
        ) : null
      }
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
        <CommonButton onClick={() => setIsModalAddOpen(true)} type='primary'>
          Thêm Tài Khoản
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredAccounts} rowKey={(record) => record.id} />
      {isModalAddOpen && <ModalAddAccount isOpen={isModalAddOpen} handleOk={handleAddOk} handleCancel={handleClose} />}
      <CertificateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        accountId={selectedId || NaN} // Truyền ID qua modal
      />
    </div>
  )
}
