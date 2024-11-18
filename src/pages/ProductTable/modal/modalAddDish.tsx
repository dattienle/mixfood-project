import React, { useState } from 'react'
import {
  Modal,
  Input,
  Button,
  Form,
  InputNumber,

  Select,
  Spin
} from 'antd'
// import Category from '~/Models/categoryModel'
import {useMutation, useQuery } from 'react-query'
// import { getCategories } from '~/api/categoriesAPI'
// import { createDish } from '~/api/dishAPI'
import { toast } from 'react-toastify'
import { getCategories } from '../../../api/categoriesAPI'
import { createDish } from '../../../api/dishAPI'
import Category from '../../../Models/categoryModel'
// import Dish from '~/Models/DishModel'
interface ModalAddProductProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  // handleChange: (value: string, key: keyof ProductTemplate) => void;
  // formValues: ProductTemplate;
}

const ModalAddProduct: React.FC<ModalAddProductProps> = ({
  isOpen,
  handleOk,
  handleCancel
  // handleChange,
  // formValues
}) => {
  // const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)


  const { isLoading, error, data: categories } = useQuery('categories', getCategories)

  const { mutate: addDish } = useMutation(createDish, {
    onSuccess: () => {
      toast.success('Thêm món ăn thành công!')
      handleOk()
    },
    onError: (error) => {
      toast.error('Thêm món ăn thất bại!')
      console.error('Error adding ingredient:', error)
    }
  })

  if (isLoading) {
    return <Spin size='large' />
  }

  if (error) {
    return <div>Lỗi</div>
  }

  const handleChangeCategory = (value: number) => {
    setSelectedCategory(value)
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

  const handleAddDish = () => {
    if (!name || !selectedCategory || !fileList) {
      toast.warning('Vui lòng điền đầy đủ thông tin!')
      return
    }
    const formData = new FormData()
    formData.append('name', name)
    formData.append('price',  (price ?? 0).toString())
    formData.append('categoryId', selectedCategory.toString())
    formData.append('imageUrl', fileList)
    console.log(formData)
    try {
      addDish(formData)
      handleOk
    } catch (error) {
      console.error('Error adding dish:', error)
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
        <Button key='submit' type='primary' onClick={handleAddDish}>
          Thêm
        </Button>
      ]}
      style={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      <Form layout='vertical'>
        <Form.Item label='Tên món ăn'>
          <Input placeholder='Nhập tên món ăn' value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item name='imageUrl' label='Image'>
          <input type='file' onChange={handleFileChange} />
        </Form.Item>
        
        <Form.Item label='Giá'>
          <InputNumber placeholder='Nhập giá' value={price} onChange={(e) => setPrice(e)} />
        </Form.Item>

        <Form.Item label='Chọn danh mục'>
          {categories ? (
            <Select placeholder='Chọn danh mục' onChange={handleChangeCategory} value={selectedCategory}>
              {categories.data.items.map((category: Category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
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

export default ModalAddProduct
