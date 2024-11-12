import React, { useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'
import Category from '~/Models/categoryModel'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { addIngredientType } from '~/api/ingredientTypeApi'

interface ModalAddIngredientTypeProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
 
}

const ModalAddIngredientType: React.FC<ModalAddIngredientTypeProps> = ({
  isOpen,
  handleOk,
  handleCancel,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const queryClient = useQueryClient();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileList(event.target.files[0])
      setPreviewImage(URL.createObjectURL(event.target.files[0]))
    } else {
      setFileList(null)
      setPreviewImage('')
    }
  }
  const handleAddIngredient = async () => {
    if (!name || !fileList) {
      toast.error('Vui lòng nhập đủ thông tin loại nguyên liệu')
      return
    }
    const formData = new FormData()
    formData.append('name', name)

    if (fileList) {
      formData.append('imageUrl', fileList)
    }

    try {
      await addIngredientType(formData)
      await queryClient.invalidateQueries('ingredient')
      toast.success('Thêm nguyên liệu thành công!')
      handleOk()
    } catch (error) {
      toast.error('Thêm nguyên liệu thất bại!')
    }
  }
  return (
    <Modal
      title='Add New Ingredient Type'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleAddIngredient}>
          Add
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Tên'>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>

        <Form.Item name='imageUrl' label='Image'>
        {(previewImage || imageUrl) && (
    <img src={previewImage || imageUrl} alt='Ingredient' style={{ maxWidth: '100px' }} />
  )}
          {/* Display existing image */}
          <input type='file' onChange={handleFileChange} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddIngredientType
