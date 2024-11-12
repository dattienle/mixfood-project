import React, { useState } from 'react'
import { Modal, Button, Form, Avatar, Radio, InputNumber } from 'antd'
import { useMutation, useQuery } from 'react-query'
// import { getIngredients } from '~/api/ingredientApi'
// import { getIngredientType } from '~/api/ingredientTypeApi'
import { toast } from 'react-toastify'
// import { createIngredientProduct } from '~/api/templateSteps'
import './../style.scss'
import { getIngredients } from '../../../api/ingredientApi'
import { getIngredientType } from '../../../api/ingredientTypeApi'
import { createIngredientProduct } from '../../../api/templateSteps'
import IngredientType from '../../../Models/ingredientTypeModel'
import Ingredient from '../../../Models/ingredientModel'
// import IngredientType from '~/Models/ingredientTypeModel'
// import Ingredient from '~/Models/ingredientModel'

interface ModalAddIngredientProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  dishId: number
}

const ModalAddIngredient: React.FC<ModalAddIngredientProps> = ({ isOpen, handleOk, handleCancel, dishId }) => {
  const [selectedIngredientType, setSelectedIngredientType] = useState<string | null>('Tinh bột')
  const [ingredientGroups, setIngredientGroups] = useState<{
    [key: string]: {
      selectedIngredients: number[]
      min: number
      max: number
    }
  }>({})

  const { data: ingredients } = useQuery('ingredients', getIngredients)
  const { data: ingredientType } = useQuery('ingredientType', getIngredientType)

  const { mutate: addIngredientMutation } = useMutation(createIngredientProduct, {
    onSuccess: () => {
      toast.success('Thêm nguyên liệu thành công!')
      handleOk()
    },
    onError: (error) => {
      toast.error('Thêm nguyên liệu thất bại!')
      console.error('Error adding ingredient:', error)
    }
  })
  // const handleSelectIngredientType = (value: string) => {
  //   setSelectedIngredientType(value)
  //   if (!ingredientGroups[value]) {
  //     setIngredientGroups((prevGroups) => ({
  //       ...prevGroups,
  //       [value]: { selectedIngredients: [], min: 0, max: 0 }
  //     }))
  //   }
  // }
  const handleSelectIngredient = (ingredientId: number) => {
    setIngredientGroups((prevGroups) => {
      const currentGroup = prevGroups[selectedIngredientType || ''] || { selectedIngredients: [], min: 0, max: 0 }
      const selectedIngredients = currentGroup.selectedIngredients.includes(ingredientId)
        ? currentGroup.selectedIngredients.filter((id) => id !== ingredientId)
        : [...currentGroup.selectedIngredients, ingredientId]
      return {
        ...prevGroups,
        [selectedIngredientType || '']: { ...currentGroup, selectedIngredients }
      }
    })
  }

  const handleMinMaxChange = (type: 'min' | 'max', value: number | null) => {
    setIngredientGroups((prevGroups) => {
      const currentGroup = prevGroups[selectedIngredientType || ''] || { selectedIngredients: [], min: 0, max: 0 }
      return {
        ...prevGroups,
        [selectedIngredientType || '']: { ...currentGroup, [type]: value || 0 }
      }
    })
  }

  const handleAddIngredients = () => {
    const requestData = {
      dishId,
      templateSteps: Object.entries(ingredientGroups).map(([type, data]) => ({
        ingredientTypeId: ingredientType?.data.items.find((t: IngredientType) => t.name === type)?.id || 0,
        ingredientId: data.selectedIngredients,
        quantityMin: data.min,
        quantityMax: data.max
      }))
    }
    console.log(requestData)
    addIngredientMutation(requestData)
  }

  const approvedIngredients = ingredients 
  ? ingredients.data.items.filter((ingredient: Ingredient) => ingredient.isApproved)
  : [];

const filteredIngredients = approvedIngredients.filter((ingredient: Ingredient) =>
  selectedIngredientType ? ingredient.ingredientType.name === selectedIngredientType : true
);

  return (
    <Modal
      title='Thêm nguyên liệu cho món ăn'
      open={isOpen}
      onOk={handleAddIngredients}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleAddIngredients}>
          Thêm
        </Button>
      ]}
      style={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      <Form layout='vertical'>
        <Form.Item label='Chọn loại nguyên liệu'>
          <Radio.Group onChange={(e) => setSelectedIngredientType(e.target.value)} value={selectedIngredientType}>
            {ingredientType?.data.items.map((type: IngredientType) => (
              <Radio.Button key={type.id} value={type.name}>
                {type.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label='Chọn nguyên liệu'>
          <div>
            {filteredIngredients.map((ingredient: Ingredient) => (
              <Avatar
                key={ingredient.id}
                src={ingredient.imageUrl}
                size={64}
                style={{ marginRight: '8px', marginBottom: '8px' }}
                onClick={() => handleSelectIngredient(ingredient.id)}
                className={
                  ingredientGroups[selectedIngredientType || '']?.selectedIngredients.includes(ingredient.id)
                    ? 'selected-ingredient'
                    : ''
                }
              />
            ))}
          </div>
          <InputNumber
            min={0}
            placeholder='Min'
            value={ingredientGroups[selectedIngredientType || '']?.min || 0}
            onChange={(value) => handleMinMaxChange('min', value)}
            style={{ marginRight: '8px' }}
          />
          <InputNumber
            min={0}
            placeholder='Max'
            value={ingredientGroups[selectedIngredientType || '']?.max || 0}
            onChange={(value) => handleMinMaxChange('max', value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddIngredient
