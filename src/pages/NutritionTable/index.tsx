import React from 'react'
import './style.scss'
import { Input, Modal, Space, Table } from 'antd'
import { CommonButton } from '~/UI/button/Button'
export default function NutritionPage() {

  // const [isModalOpen, setIsModalOpen] = useState(false)

  // const 
  return (
    <div style={{ background: 'white', padding: '20px' }}>
      <h1>Quản Lý Danh Mục</h1>
      {/* <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <CommonButton onClick={handleAddCategory} type='primary' icon={<PlusOutlined />}>
          Thêm Danh Mục
        </CommonButton>
      </Space>
      <Modal title='Thêm danh mục' style={{}}  open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <Input placeholder='Nhập tên danh mục' />
      </Modal>
      <Modal title='Chỉnh sửa danh mục' style={{}}  open={isModalEditOpen} onCancel={() => setIsModalEditOpen(false)}>
        <Input placeholder='Nhập tên danh mục' value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
      </Modal>
    
      <Table columns={columns} dataSource={filteredData} rowKey={(record) => record.id} /> */}
    </div>
  )
}

