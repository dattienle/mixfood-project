import React, { useState } from 'react'
import { Modal, Input, Button, InputNumber, Form } from 'antd'
import Ingredient from '../../../Models/ingredientModel'
import { getIngredientById, updateIngredientById } from '../../../api/ingredientApi'
import { useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
// import Ingredient from '~/Models/ingredientModel'

interface ModalAddCategoryProps {
  isOpen: boolean
  ingredientId: number
  handleOk: () => void
  handleCancel: () => void
}

const ModalAddCalo: React.FC<ModalAddCategoryProps> = ({ isOpen, ingredientId, handleOk, handleCancel }) => {
  const [calo, setCalo] = useState(0)
  const {
    isLoading: nutritionLoading,
    error: nutritionError,
    data: nutritionData
  } = useQuery(['ingredientType', ingredientId], () => getIngredientById(ingredientId), {
    enabled: isOpen && !!ingredientId,
    onSuccess: (data: any) => {
     
      setCalo(data.data.calo)
     
    }
  })
  const queryClient = useQueryClient()
  const handleOkClick = async () => {
    const formData = new FormData()
    formData.append('Calo',String(calo))

    try {
      await updateIngredientById({ id: ingredientId, data: formData })
      await queryClient.invalidateQueries('ingredient')
      toast.success('Cập nhật calo thành công!')
      handleOk()
    } catch (error) {
      toast.error('Cập nhật calo thất bại!')
    }
  }

  return (
    <Modal
      title='Chỉnh sửa Calo cho nguyên liệu'
      open={isOpen}
      onOk={handleOkClick}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleOkClick}>
          Add
        </Button>
      ]}
    >
      <Form.Item label='calo'>
      <Input type='number' value={calo} onChange={(e) => setCalo(parseInt(e.target.value) || 0)} />{' '}
      </Form.Item>
    </Modal>
  )
}

export default ModalAddCalo
