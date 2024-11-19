import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form, message, Select, Spin, Typography } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { getIngredientById, updateIngredientById } from '../../../api/ingredientApi'
import { getIngredientType } from '../../../api/ingredientTypeApi'
import IngredientType from '../../../Models/ingredientTypeModel'
// import { updateNutritionById, getNutritionById } from '~/api/nutritionApi'
// import { getIngredientById, getIngredients, updateIngredientById } from '~/api/ingredientApi'
// import Nutrition from '~/Models/nutritionModel'
// import { getIngredientType } from '~/api/ingredientTypeApi'
// import IngredientType from '~/Models/ingredientTypeModel'

interface ModalUpdateIngredientProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  ingredientId: number // Nhận ID của nutrition cần update
}

const ModalUpdateIngredient: React.FC<ModalUpdateIngredientProps> = ({
  isOpen,
  handleOk,
  handleCancel,
  ingredientId
}) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [urlInfo, setUrlInfo] = useState('')
  const [fileList, setFileList] = useState<File | null>(null)
  const [selectedIngredientType, setSelectedIngredientType] = useState<number | null>(null)
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
  } = useQuery(['ingredient', ingredientId], () => getIngredientById(ingredientId), {
    enabled: isOpen && !!ingredientId,
    onSuccess: (data: any) => {
      if (!dataLoaded) {
        // Chỉ load dữ liệu lần đầu
        setName(data.data.name)
        setPrice(data.data.price)
        setImageUrl(data.data.imageUrl)
        setQuantity(data.data.quantity)
        setUrlInfo(data.data.urlInfo)
        setSelectedIngredientType(data.data.ingredientType.id)
        setDataLoaded(true)
      }
    }
  })
  const { isLoading, error, data: ingredientType } = useQuery('ingredientType', getIngredientType)
  const { mutate: updateIngredientMutation } = useMutation(updateIngredientById, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('ingredient')
      toast.success('Cập nhật dinh dưỡng thành công!')
      handleOk()
    },
    onError: (error) => {
      toast.error('Cập nhật dinh dưỡng thất bại!')
      console.error('Error updating nutrition:', error)
    }
  })
  const handleChangeIngredientType = (value: number) => {
    setSelectedIngredientType(value)
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

  const handleUpdateIngredient = async () => {
    const formData = new FormData()
  
    formData.append('price', String(price))
    formData.append('quantity', String(quantity))
    formData.append('urlInfo', urlInfo)
    if (selectedIngredientType) formData.append('IngredientTypeId', selectedIngredientType.toString())

    if (fileList) {
      formData.append('Images', fileList)
    }

    await updateIngredientMutation({ id: ingredientId, data: formData })
  }

  return (
    <Modal
      title='Cập nhật nguyên liệu'
      open={isOpen}
      onOk={handleUpdateIngredient}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleUpdateIngredient}>
          Cập nhật
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Nguyên liệu'>
          <Typography.Text>{name}</Typography.Text>
        </Form.Item>
        <Form.Item label='Giá'>
          <Input type='number' value={price} onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)} />{' '}
          {/* Use parseInt and handle NaN */}
        </Form.Item>

        <Form.Item name='imageUrl' label='Image'>
          {(previewImage || imageUrl) && (
            <img src={previewImage || imageUrl} alt='Ingredient' style={{ maxWidth: '100px' }} />
          )}
          <input type='file' onChange={handleFileChange} />
        </Form.Item>
        <Form.Item label='Số lượng'>
          <Input type='number' value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} />{' '}
          {/* Use parseInt and handle NaN */}
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

export default ModalUpdateIngredient
