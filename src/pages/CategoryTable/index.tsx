import React from 'react'
import { Button, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'

interface DataType {
  key: string
  name: string
  description: string
}
// const navigate = useNavigate();
const columns: ColumnsType<DataType> = [
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'Số lượng sản phẩm',
    dataIndex: 'productCount',
    key: 'productCount'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status'
  }
]

const data: DataType[] = [
  {
    key: '1',
    name: 'Điện thoại',
    description: 'Các loại điện thoại di động'
  },
  {
    key: '2',
    name: 'Máy tính',
    description: 'Máy tính để bàn và laptop'
  }
  // Thêm dữ liệu mẫu khác nếu cần
]

export default function CategoryPage() {
  return (
    <div>
      <h1>Danh sách danh mục</h1>
      {/* <Table columns={columns} dataSource={data} /> */}
      {/* <Button type="primary" onClick={() => navigate('/category/create')}>
        Thêm danh mục
      </Button> */}
    </div>
  )
}
