import React, { useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'
import Category from '../../../Models/categoryModel'
import { createCategory } from '../../../api/categoriesAPI'
import { toast } from 'react-toastify'
import { createNews } from '../../../api/newsApi'
interface ModalAddCategoryProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

const ModalAddNews: React.FC<ModalAddCategoryProps> = ({ isOpen, handleOk, handleCancel }) => {
  const [title, setTilte] = useState('')
  const [description, setDescription] = useState('')
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
    if(!title || !description || !fileList){
      toast.error("Vui lòng điền đầy đủ thông tin")
    }
    formData.append('Title', title)
    formData.append('Description', description)

    if (fileList) {
      formData.append('ImageUrl', fileList)
    }
    console.log(formData)
    try {
      await createNews(formData) 
      toast.success('Thêm tin tức thành công!')
      handleOk()
    } catch (error) {
      toast.error('Thêm tin tức thất bại!')
      console.error('Error adding nutrition:', error)
    }
  }
  return (
    <Modal
      title='Thêm mới tin tức'
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
        <Form.Item label='Tiêu Đề'>
          <Input value={title} onChange={(e) => setTilte(e.target.value)} />
        </Form.Item>
        <Form.Item label='Mô tả'>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item name='imageUrl' label='Image'>
          <input type='file' onChange={handleFileChange} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddNews
