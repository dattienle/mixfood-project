import React, { useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'
import Category from '../../../Models/categoryModel'
import { createCategory } from '../../../api/categoriesAPI'
import { toast } from 'react-toastify'
interface ModalAddCategoryProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

const ModalAddCategory: React.FC<ModalAddCategoryProps> = ({ isOpen, handleOk, handleCancel }) => {
  const [name, setName] = useState('')

  const [fileList, setFileList] = useState<File | null>(null)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileList(event.target.files[0])
    } else {
      setFileList(null)
    }
  }

  const handleAddCategory = async () => {
    const formData = new FormData()
    
    formData.append('Name', name)
    if (fileList) {
      formData.append('Images', fileList)
    }
    console.log(formData)
    try {
      await createCategory(formData) 
      toast.success('Thêm dinh dưỡng thành công!')
      handleOk()
    } catch (error) {
      toast.error('Thêm dinh dưỡng thất bại!')
      console.error('Error adding nutrition:', error)
    }
  }
  return (
    <Modal
      title='Thêm mới danh mục'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleAddCategory}>
          Add
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Tên'>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item name='imageUrl' label='Image'>
          <input type='file' onChange={handleFileChange} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddCategory
