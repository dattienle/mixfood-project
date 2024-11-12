import React, { useState } from 'react'
import { Modal, Input, Button, InputNumber, Form } from 'antd'
import Ingredient from '~/Models/ingredientModel'

interface ModalAddCategoryProps {
  isOpen: boolean
  ingredient: Ingredient
  handleOk: (updatedIngredient: Ingredient) => void
  handleCancel: () => void
}

const ModalAddCalo: React.FC<ModalAddCategoryProps> = ({ isOpen, ingredient, handleOk, handleCancel }) => {
  const [calo, setCalo] = useState<number>(ingredient.calo ?? 0)
  const handleCaloChange = (value: number | null) => {
    if (value === null) {
      setCalo(0)
    } else {
      setCalo(value)
    }
  }

  const handleOkClick = () => {
    const updatedCalo = calo ?? 0
    const updatedIngredient = { ...ingredient, calo: updatedCalo }
    handleOk(updatedIngredient)
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
      <Form.Item label='Calo'>
        <InputNumber style={{ width: '100%' }} value={calo} onChange={handleCaloChange} />
      </Form.Item>
    </Modal>
  )
}

export default ModalAddCalo
