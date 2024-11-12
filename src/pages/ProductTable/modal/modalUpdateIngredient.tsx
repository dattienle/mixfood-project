import React, { useState } from 'react'
import {
  Modal,
  Input,
  Button,
  Form,
  InputNumber,
  GetProp,
  UploadProps,
  UploadFile,
  Upload,
  Image,
  message,
  Select,
  Spin,
  Avatar,
  Radio
} from 'antd'
// import Category from '~/Models/categoryModel'
// import ProductTemplate from '~/Models/productTemplateModel'

import { PlusOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'
import { getIngredients } from '../../../api/ingredientApi'
import { getIngredientType } from '../../../api/ingredientTypeApi'
import Ingredient from '../../../Models/ingredientModel'
import IngredientType from '../../../Models/ingredientTypeModel'
// import { getCategories } from '~/api/categoriesAPI'
// import { getIngredients } from '~/api/ingredientApi'
// import Ingredient from '~/Models/ingredientModel'
// import { getIngredientType } from '~/api/ingredientTypeApi'
// import IngredientType from '~/Models/ingredientTypeModel'
interface ModalUpdateIngredientProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  // handleChange: (value: string, key: keyof ProductTemplate) => void;
  // formValues: ProductTemplate;
}

const ModalUpdateIngredient: React.FC<ModalUpdateIngredientProps> = ({
  isOpen,
  handleOk,
  handleCancel
  // handleChange,
  // formValues
}) => {



  // Call api category để selected

  const [selectedIngredientType, setSelectedIngredientType] = useState<string | null>('BASE')

  const {
    isLoading: isLoadingIngredient,
    error: errorIngredient,
    data: ingredients
  } = useQuery('ingredients', getIngredients)
  const {
    isLoading: isLoadingIngredientType,
    error: errorIngredientType,
    data: ingredientType
  } = useQuery('ingredientType', getIngredientType)
  console.log(ingredientType)


  const handleSelectIngredientType = (value: string) => {
    setSelectedIngredientType(value)
  }

  const filteredIngredients = ingredients
    ? ingredients.data.items.filter((ingredient: Ingredient) =>
        selectedIngredientType ? ingredient.ingredientType.name === selectedIngredientType : true
      )
    : []
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
        <Button key='submit' type='primary' onClick={handleOk}>
          Thêm
        </Button>
      ]}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      <Form layout='vertical'>
        <Form.Item label='Chọn loại nguyên liệu'>
          <Radio.Group onChange={(e) => handleSelectIngredientType(e.target.value)} value={selectedIngredientType}>
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
              />
            ))}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalUpdateIngredient
