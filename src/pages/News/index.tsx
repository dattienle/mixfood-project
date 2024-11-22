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
import { getNews, updateStatusNews } from '../../api/newsApi'
import News from '../../Models/newsModel'
import ModalAddNews from './Modal/modalAdd'
import ModalUpdateNews from './Modal/modalUpdate'


export default function NewsPage() {
  const [searchText, setSearchText] = useState('')
  // const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const {
    data: newsResponse,
    isLoading,
    refetch: refetchNews,
    isError
  } = useQuery('news', getNews, { refetchOnMount: true })
  const news = newsResponse?.data.items

  // updateStatus
  const updateStatus = useMutation(updateStatusNews, {
    onSuccess: () => {
      queryClient.invalidateQueries('news')
      toast.success('Cập nhật trạng thái thành công!')

      refetchNews()
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
    await refetchNews()
  }
  // status || mutate
  const handleStatusChange = (id: number, isDelete: boolean) => {
    updateStatus.mutate({ id, isDelete })
  }
  const handleEditOk = async () => {
    setIsModalUpdateOpen(false)
    await refetchNews()
  }

  const handleClose = () => {
    setIsModalUpdateOpen(false)
    setIsModalAddOpen(false)
  }

  const columns: ColumnsType<News> = [

    {
      title: 'Tiêu Đề',
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description',
      align: 'center'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'image',
      align: 'center',
      render: (imageUrl: string) => <img src={imageUrl} alt='Hình ảnh sản phẩm' style={{ width: 100, height: 100 }} />
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
              setSelectedNews(record)
            }}
          >
            <EditOutlined style={{ color: '#F8B602', fontSize: '22px' }} />
          </Button>
        </Space>
      )
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

  const filteredData =
    news?.filter((item: News) => item.title.toLowerCase().includes(searchText.toLowerCase())) || []

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Tin Tức</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tên'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton onClick={() => setIsModalAddOpen(true)} type='primary' icon={<PlusOutlined />}>
          Thêm Tin Tức
        </CommonButton>
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey={(record) => record.id} />
      {isModalUpdateOpen && (
        <ModalUpdateNews
          isOpen={isModalUpdateOpen}
          handleOk={handleEditOk}
          handleCancel={handleClose}
          newsId={selectedNews?.id || NaN}
        />
      )}
      {isModalAddOpen && <ModalAddNews isOpen={isModalAddOpen} handleOk={handleAddOk} handleCancel={handleClose} />}
    </div>
  )
}
