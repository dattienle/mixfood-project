import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form, message, Select, Spin, Typography } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { updateIngredientById } from '../../../api/ingredientApi'

import { getDishById, updateDishById } from '../../../api/dishAPI'
import { getCategories } from '../../../api/categoriesAPI'
import Category from '../../../Models/categoryModel'

interface ModalUpdateDishProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  dishId: number // Nhận ID của nutrition cần update
}

const ModalUpdateDish: React.FC<ModalUpdateDishProps> = ({ isOpen, handleOk, handleCancel, dishId }) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [imageUrl, setImageUrl] = useState('')

  const [fileList, setFileList] = useState<File | null>(null)
  const [selectedCategorytype, setSelectedCategoryType] = useState<number | null>(null)
  const queryClient = useQueryClient()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    if (!isOpen) setDataLoaded(false) // Reset cờ khi modal đóng
  }, [isOpen])
  const {
    isLoading: dishLoading,
    error: dishError,
    data: dishData
  } = useQuery(['dish', dishId], () => getDishById(dishId), {
    enabled: isOpen && !!dishId,
    onSuccess: (data: any) => {
      if (!dataLoaded) {
        setName(data.data.name)
        setPrice(data.data.price)
        setImageUrl(data.data.imageUrl)
        setSelectedCategoryType(data.data.category.id)
        setDataLoaded(true)
      }
    }
  })
  const { isLoading, error, data: categoriesResponse } = useQuery('categories', getCategories)
  const { mutate: updateDishMutation } = useMutation(updateDishById, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('productTemplate')
      toast.success('Cập nhật món ăn thành công!')
      handleOk()
    },
    onError: (error) => {
      console.error('Error updating dish:', error)
      toast.error('Cập nhật món ăn thất bại!')
    }
  })
  const handleChangeCategoryType = (value: number) => {
    setSelectedCategoryType(value)
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

  // const handleUpdateCategory = async () => {
  //   const formData = new FormData()
  //   let hasChanges = false

  //   formData.append('Price', String(price))

  //   if (selectedCategorytype) formData.append('CategoryId', selectedCategorytype.toString())

  //   if (fileList) {
  //     formData.append('ImageUrl', fileList)
  //   } else {
  //     formData.append('ImageUrl', imageUrl)
  //   }
  //   for (const [key, value] of formData.entries()) {
  //     console.log(key, value)
  //   }
  //   await updateDishMutation({ id: dishId, data: formData })
  // }
  const handleUpdateCategory = async () => {
    const formData = new FormData()
    let hasChanges = false // Biến kiểm tra xem có thay đổi hay không

    // Kiểm tra và thêm các trường đã thay đổi
    if (!name || !price || !selectedCategorytype) {
      toast.error('Vui lòng điền đủ thông tin')
      return
    }

    // Nếu tên món ăn thay đổi, thêm vào formData
    if (name !== dishData?.data?.name) {
      formData.append('Name', name)
      hasChanges = true
    }

    // Nếu giá thay đổi, thêm vào formData
    if (price !== dishData?.data?.price) {
      formData.append('Price', price.toString())
      hasChanges = true
    }

    // Nếu danh mục thay đổi, thêm vào formData
    if (selectedCategorytype !== dishData?.data?.category.id) {
      formData.append('CategoryId', selectedCategorytype.toString())
      hasChanges = true
    }

    // Nếu hình ảnh thay đổi, thêm vào formData
    if (fileList) {
      formData.append('ImageUrl', fileList)
      hasChanges = true
    } else if (imageUrl !== dishData?.data?.imageUrl) {
      formData.append('ImageUrl', imageUrl)
      hasChanges = true
    }

    // Nếu không có thay đổi nào thì không gửi yêu cầu cập nhật
    if (!hasChanges) {
      toast.warning('Không có thay đổi nào để cập nhật!')
      return
    }

    // In ra các trường đã thay đổi
    for (const [key, value] of formData.entries()) {
      console.log(key, value)
    }

    // Gửi yêu cầu cập nhật dữ liệu
    try {
      await updateDishMutation({ id: dishId, data: formData })
      await queryClient.invalidateQueries('dish') // invalidate queries liên quan đến món ăn
      toast.success('Cập nhật món ăn thành công!')
      handleOk()
    } catch (error) {
      toast.error('Cập nhật món ăn thất bại!')
    }
  }

  return (
    <Modal
      title='Cập nhật món ăn'
      open={isOpen}
      onOk={handleUpdateCategory}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleUpdateCategory}>
          Cập nhật
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Tên'>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>

        <Form.Item label='Giá'>
          <Input type='number' min={0} value={price} onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)} />{' '}
        </Form.Item>

        <Form.Item name='imageUrl' label='Image'>
          {(previewImage || imageUrl) && (
            <img src={previewImage || imageUrl} alt='Ingredient' style={{ maxWidth: '100px' }} />
          )}
          <input type='file' onChange={handleFileChange} />
        </Form.Item>
        <Form.Item label='Chọn danh mục'>
          {categoriesResponse ? (
            <Select placeholder='Danh mục' onChange={handleChangeCategoryType} value={selectedCategorytype}>
              {categoriesResponse.data.items
                .filter((category: Category) => !category.isDeleted)
                .map((category: Category) => (
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

export default ModalUpdateDish
