import { Button, Input, Modal, Space, Switch, Upload } from 'antd'
import React, { useState } from 'react'
import { SearchOutlined, PlusOutlined,UploadOutlined } from '@ant-design/icons'
import Table, { ColumnType } from 'antd/es/table'
import { EditOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { createMaterial, getMaterial } from '../../api/material'
import Ingredient from '../../Models/ingredientModel'
import { CommonButton } from '../../UI/button/Button'

export default function MaterialIngredient() {
  const [searchText, setSearchText] = useState('')
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const queryClient = useQueryClient()

  // Sử dụng useQuery để gọi API getMaterial
  const { data: materialResponse, isLoading, isError } = useQuery('material', getMaterial)
  const materials = materialResponse?.data || []
  const mutation = useMutation(createMaterial, {
    onSuccess: () => {
      toast.success('Tải lên thành công!')
      queryClient.invalidateQueries('material')
      setIsModalAddOpen(false)
    },
    onError: () => {
      toast.error('Tải lên thất bại!')
    }
  })
  const handleUpload = (file: File) => {
    mutation.mutate(file)
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
      title: 'Calo',
      dataIndex: 'calo',
      key: 'calo',
      align: 'center'
    },
    {
      title: 'Fat',
      dataIndex: 'fat',
      key: 'fat',
      align: 'center'
    },
    {
      title: 'Protein',
      dataIndex: 'protein',
      key: 'protein',
      align: 'center'
    },
    {
      title: 'Carbohydrate',
      dataIndex: 'carbohydrate',
      key: 'carbohydrate',
      align: 'center'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      align: 'center'
    }
  ]

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const filteredData =
    materials.filter(
      (item: Ingredient) => item.name.toLowerCase().includes(searchText.toLowerCase())
    ) || []

  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Nguyên Liệu</h1>
      <CommonButton type='primary' icon={<PlusOutlined />} onClick={() => setIsModalAddOpen(true)}>
        Thêm thành phần nguyên liệu
      </CommonButton>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder='Tìm kiếm theo tên'
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
      </Space>
      <Table columns={columns} dataSource={filteredData} />
      <Modal
        title="Tải lên file Excel"
        visible={isModalAddOpen}
        centered
        onCancel={() => setIsModalAddOpen(false)}
        footer={null}
      >
        <Upload
          beforeUpload={(file) => {
            handleUpload(file)
            return false
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Chọn file</Button>
        </Upload>
      </Modal>
    </div>
  )
}
