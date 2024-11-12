import React, { useState } from 'react'
import { Modal, Input, Button, Form, message, Select, Spin } from 'antd'

import { useMutation, useQuery } from 'react-query'

import { toast } from 'react-toastify'
import { createNutrition } from '~/api/nutritionApi'
import { getIngredients } from '~/api/ingredientApi'

interface ModalAddNutrition {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  // handleChange: (value: string, key: keyof ProductTemplate) => void;
  // formValues: ProductTemplate;
}
const ModalAddProduct: React.FC<ModalAddNutrition> = ({
  isOpen,
  handleOk,
  handleCancel
  // handleChange,
  // formValues
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [vitamin, setVitamin] = useState('')
  const [healthValue, setHealthValue] = useState('')
  const [nutrilite, setNutrilite] = useState('')

  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([])

  const {
    isLoading: ingredientsLoading,
    error: ingredientsError,
    data: ingredientsData
  } = useQuery('ingredients', getIngredients)
  const { mutate: addNutrition } = useMutation(createNutrition, {})

  if (ingredientsLoading) {
    return <Spin size='large' />
  }

  if (ingredientsError) {
    return <div>Lỗi</div>
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileList(event.target.files[0])
      setPreviewImage(URL.createObjectURL(event.target.files[0]))
    } else {
      setFileList(null)
      setPreviewImage('')
    }
  }
  const handleIngredientChange = (value: any[]) => {
    setSelectedIngredients(value)
  }
  const handleAddNutrition = async () => {
    if (!selectedIngredients) {
      message.error('Vui lòng chọn nguyên liệu.')
      return
    }

    const formData = new FormData()
    formData.append('ingredientId', selectedIngredients.toString())
    formData.append('description', description)
    formData.append('vitamin', vitamin)
    formData.append('healthValue', healthValue)
    formData.append('nutrilite', nutrilite)

    if (fileList) {
      formData.append('imageUrl', fileList)
    }

    try {
      await addNutrition(formData) // Dùng await để bắt lỗi trực tiếp
      handleOk()
      toast.success('Thêm dinh dưỡng thành công!')
    } catch (error) {
      toast.error('Thêm dinh dưỡng thất bại!')
      console.error('Error adding nutrition:', error)
    }
  }
  return (
    <Modal
      title='Thêm món ăn mới'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleAddNutrition}>
          Thêm
        </Button>
      ]}
      style={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      <Form layout='vertical'>
        <Form.Item label='Nguyên liệu'>
          <Select placeholder='Chọn nguyên liệu' onChange={handleIngredientChange} style={{ width: '100%' }}>
            {ingredientsData?.data?.items.map((ingredient: any) => (
              <Select.Option key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name='imageUrl' label='Image'>
          <input type='file' onChange={handleFileChange} />
        </Form.Item>
        <Form.Item label='Description'>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item label='Vitamin'>
          <Input value={vitamin} onChange={(e) => setVitamin(e.target.value)} />
        </Form.Item>
        <Form.Item label='Health Value'>
          <Input value={healthValue} onChange={(e) => setHealthValue(e.target.value)} />
        </Form.Item>
        <Form.Item label='Nutrilite'>
          <Input value={nutrilite} onChange={(e) => setNutrilite(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddProduct
