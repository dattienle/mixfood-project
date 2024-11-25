import React, { useState } from 'react'
import { Modal, Input, Button, Form, Select, Spin } from 'antd'

import { useQuery, useQueryClient } from 'react-query'
// import { getCategories } from '~/api/categoriesAPI'
// import { getIngredientType } from '~/api/ingredientTypeApi'
// import { createDish } from '~/api/dishAPI'
import { toast } from 'react-toastify'
import { getIngredientType } from '../../../api/ingredientTypeApi'
import { addIngredient, getIngredients } from '../../../api/ingredientApi'
import IngredientType from '../../../Models/ingredientTypeModel'
import { createIngredientMaterial, getMaterial } from '../../../api/material'
import { DefaultOptionType } from 'antd/es/select'
// import Dish from '~/Models/DishModel'
// import IngredientType from '~/Models/ingredientTypeModel'
// import { addIngredient } from '~/api/ingredientApi'

interface ModalAddIngredientProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  // handleChange: (value: string, key: keyof ProductTemplate) => void;
  // formValues: ProductTemplate;
}
const ModalAddNew: React.FC<ModalAddIngredientProps> = ({
  isOpen,
  handleOk,
  handleCancel
  // handleChange,
  // formValues
}) => {
const [name, setName] = useState('')
  const queryClient = useQueryClient()



  const handleAddIngredient = async () => {
    if (!name) {
      toast.error('Vui lòng nhập đủ thông tin nguyên liệu')
      return
    }
    const formData = new FormData()
    formData.append('Name',name)
    try {
      await createIngredientMaterial(formData)
      toast.success('Đề xuất thành công!')
      handleOk()
    } catch (error) {
      toast.error('Đề xuất thất bại!')
    }
  }
  return (
    <Modal
      title='Đề Xuất Nguyên Liệu mới'
      open={isOpen}
      onOk={handleAddIngredient}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleAddIngredient}>
          Thêm
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Tên Nguyên Liệu'>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddNew
