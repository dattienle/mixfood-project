import React, { useState } from 'react'
import {
  Modal,
  Input,
  Button,
  Form,
  Select,
  Spin
} from 'antd'

import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query'
// import { getCategories } from '~/api/categoriesAPI'
// import { getIngredientType } from '~/api/ingredientTypeApi'
// import { createDish } from '~/api/dishAPI'
import { toast } from 'react-toastify'
import { getIngredientType } from '../../../api/ingredientTypeApi'
import { addIngredient } from '../../../api/ingredientApi'
import IngredientType from '../../../Models/ingredientTypeModel'
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
const ModalAddIngredient: React.FC<ModalAddIngredientProps> = ({
  isOpen,
  handleOk,
  handleCancel
  // handleChange,
  // formValues
}) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [urlInfo, setUrlInfo] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<File | null>(null)

  const [selectedIngredientType, setSelectedIngredientType] = useState<number | null>(null)
  const queryClient = useQueryClient();


  const { isLoading, error, data: ingredientType } = useQuery('ingredientType', getIngredientType)

  

  if (isLoading) {
    return <Spin size='large' />
  }

  if (error) {
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
  const handleChangeIngredientType = (value: number) => {
    setSelectedIngredientType(value)
  }
 const handleAddIngredient = async() =>{
if(!name || !price || ! fileList || !quantity || !urlInfo){
  toast.error("Vui lòng nhập đủ thông tin nguyên liệu")
  return

}
  const formData = new FormData()
  formData.append('name', name)
  formData.append('price', String(price))
  formData.append('quantity', String(quantity)) 
  formData.append('urlInfo', urlInfo)
  if(selectedIngredientType)
  formData.append('IngredientTypeId', selectedIngredientType.toString() )

  if (fileList) {
      formData.append('imageUrl', fileList)
  }

  try {
    await addIngredient( formData )
     await queryClient.invalidateQueries('ingredient');
    toast.success('Thêm nguyên liệu thành công!')
    handleOk()
  } catch (error) {
    toast.error('Thêm nguyên liệu thất bại!')
    
 }
}
  return (
    <Modal
    title='Thêm mới nguyên liệu'
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
      </Button>,
    ]}
  >
    <Form layout='vertical'>

      <Form.Item label='Tên'>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Item>

      <Form.Item label='Giá'>
        <Input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)} /> {/* Use parseInt and handle NaN */}
      </Form.Item>

      <Form.Item name='imageUrl' label='Image'>
        {imageUrl && <img src={imageUrl} alt="Ingredient" style={{ maxWidth: '100px' }} />} {/* Display existing image */}
        <input type='file' onChange={handleFileChange} />
      </Form.Item>
      <Form.Item label='Số lượng'>
          <Input type="number" value={quantity}   onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} /> {/* Use parseInt and handle NaN */}
      </Form.Item>
      <Form.Item label='URL thông tin'>
        <Input value={urlInfo} onChange={(e) => setUrlInfo(e.target.value)} />
      </Form.Item>
      <Form.Item label='Chọn loại nguyên liệu'>
          {ingredientType ? (
            <Select placeholder='Loại nguyên liệu' onChange={handleChangeIngredientType} value={selectedIngredientType}>
              {ingredientType.data.items.map((ingredientType: IngredientType) => (
                <Select.Option key={ingredientType.id} value={ingredientType.id}>
                  {ingredientType.name}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <div>Chưa có danh mục nào </div>
          )}
        </Form.Item>
    </Form>
  </Modal>
  )
}

export default ModalAddIngredient