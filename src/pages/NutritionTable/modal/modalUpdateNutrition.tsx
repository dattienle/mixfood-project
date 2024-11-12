import React, { useState } from 'react'
import { Modal, Input, Button, Form, message, Select, Spin, Typography } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { getNutritionById, updateNutritionById } from '../../../api/nutritionApi'
// import { updateNutritionById, getNutritionById } from '~/api/nutritionApi'
// import { getIngredients } from '~/api/ingredientApi'
// import Nutrition from '~/Models/nutritionModel'

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
  const [nutrilite, setNutrilite] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState('')
  const [fileList, setFileList] = useState<File | null>(null)
  const queryClient = useQueryClient();

  const {
    isLoading: nutritionLoading,
    error: nutritionError,
    data: nutritionData
  } = useQuery(['nutrition', nutritionId], () => getNutritionById(nutritionId), {
    enabled: isOpen && !!nutritionId,
    onSuccess: (data: any) => {
      setDescription(data.data.description)
      setVitamin(data.data.vitamin)
      setHealthValue(data.data.healthValue)
      setNutrilite(data.data.nutrilite)

      const ingredientNames = data.data.ingredient.name 
      setSelectedIngredients(ingredientNames)
    }
  })

  const { mutate: updateNutritionMutation } = useMutation(updateNutritionById, {})

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileList(event.target.files[0])
    } else {
      setFileList(null)
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
    formData.append('nutrilite', nutrilite)
   
    if (fileList) {
      formData.append('imageUrl', fileList)
    }
    for (const pair of formData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]); 
    }
    console.log(formData.get('imageUrl')); 
    try {
      await updateNutritionMutation({ id: nutritionId, data: formData })
      queryClient.invalidateQueries('nutrition');
      toast.success('Cập nhật dinh dưỡng thành công!')
      handleOk()
    } catch (error) {
      toast.error('Cập nhật dinh dưỡng thất bại!')
      console.error('Error updating nutrition:', error)
    }
  }

  return (
    <Modal
      title='Cập nhật dinh dưỡng'
      open={isOpen}
      onOk={handleUpdateNutrition}
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

export default ModalUpdateNutrition
