import { Input, Space } from 'antd'
import React from 'react'
import { CommonButton } from '~/UI/button/Button'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

export default function IngredientPage() {
  return <div style={{ background: 'white', padding: '20px' }}>
    <h1>Quản Lý Nguyên Liệu</h1>
    <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên"
          // onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton type='primary' icon={<PlusOutlined />}>
          Thêm Danh Mục
        </CommonButton>
      </Space>
      {/* <Table columns={columns} dataSource={filteredData} /> */}
  </div>
}
