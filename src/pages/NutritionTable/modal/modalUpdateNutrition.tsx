import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form, message, Select, Spin, Typography } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { getNutritionById, updateNutritionById } from '../../../api/nutritionApi'

interface ModalUpdateNutritionProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  nutritionId: number // Nhận ID của nutrition cần update
}

const ModalUpdateNutrition: React.FC<ModalUpdateNutritionProps> = ({ isOpen, handleOk, handleCancel, nutritionId }) => {
  const [description, setDescription] = useState('')
  const [vitamin, setVitamin] = useState('')
  const [healthValue, setHealthValue] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [nutrilite, setNutrilite] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState('')
  const [fileList, setFileList] = useState<File | null>(null)
  const queryClient = useQueryClient()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    if (!isOpen) setDataLoaded(false) // Reset cờ khi modal đóng
  }, [isOpen])
  const {
    isLoading: nutritionLoading,
    error: nutritionError,
    data: nutritionData
  } = useQuery(['nutrition', nutritionId], () => getNutritionById(nutritionId), {
    enabled: isOpen && !!nutritionId,
    onSuccess: (data: any) => {
      if (!dataLoaded) {
        setDescription(data.data.description)
        setVitamin(data.data.vitamin)
        setHealthValue(data.data.healthValue)
        setImageUrl(data.data.imageUrl)
        setDataLoaded(true)
      }

      const ingredientNames = data.data.ingredient.name
      setSelectedIngredients(ingredientNames)
    }
  })

  const { mutate: updateNutritionMutation } = useMutation(updateNutritionById, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('nutritions')
      toast.success('Cập nhật dinh dưỡng thành công!')
      handleOk()
    },
    onError: (error) => {
      toast.error('Cập nhật dinh dưỡng thất bại!')
      console.error('Error updating nutrition:', error)
    }
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileList(event.target.files[0])
      setPreviewImage(URL.createObjectURL(event.target.files[0]))
    } else {
      setFileList(null)
      setPreviewImage('')
    }
  }
  const handleUpdateNutrition = async () => {
    if (!selectedIngredients) {
      message.error('Vui lòng chọn nguyên liệu.')
      return
    }

    const formData = new FormData()

    formData.append('description', description)
    formData.append('vitamin', vitamin)
    formData.append('healthValue', healthValue)
  

    if (fileList) {
      formData.append('imageUrl', fileList)
    }

    await updateNutritionMutation({ id: nutritionId, data: formData })
  }

  return (
    <Modal
      title='Cập nhật dinh dưỡng'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleUpdateNutrition}>
          Cập nhật
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Nguyên liệu'>
          <Typography.Text>{selectedIngredients}</Typography.Text>
        </Form.Item>
        <Form.Item name='imageUrl' label='Image'>
          {(previewImage || imageUrl) && (
            <img src={previewImage || imageUrl} alt='Ingredient' style={{ maxWidth: '100px' }} />
          )}
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

      </Form>
    </Modal>
  )
}

export default ModalUpdateNutrition
