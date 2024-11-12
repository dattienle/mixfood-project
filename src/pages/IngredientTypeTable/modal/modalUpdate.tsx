import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'
// import Category from '~/Models/categoryModel'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { getIngredientTypeById, updateIngredientTypeById } from '../../../api/ingredientTypeApi'
// import { addIngredientType, getIngredientTypeById, updateIngredientTypeById } from '~/api/ingredientTypeApi'
// import IngredientType from '~/Models/ingredientTypeModel'

interface ModalUpdateIngredientTypeProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
 ingredientTypeId: number
}

const ModalUpdateIngredientType: React.FC<ModalUpdateIngredientTypeProps> = ({
  isOpen,
  handleOk,
  handleCancel,
  ingredientTypeId
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const queryClient = useQueryClient();
  const {
    isLoading: nutritionLoading,
    error: nutritionError,
    data: nutritionData
  } = useQuery(['ingredientType', ingredientTypeId], () => getIngredientTypeById(ingredientTypeId), {
    enabled: isOpen && !!ingredientTypeId,
    onSuccess: (data: any) => {
      setName(data.data.name);
      setImageUrl(data.data.imageUrl)
    }
  })
useEffect(() =>{
  if(fileList){
    setImageUrl(previewImage)
  }
},[fileList])
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
    formData.append('name', name)

    if (fileList) {
      formData.append('imageUrl', fileList)
    }

    try {
      await updateIngredientTypeById({ id: ingredientTypeId, data: formData })
      await queryClient.invalidateQueries('ingredient')
      toast.success('Chỉnh sửa nguyên liệu thành công!')
      handleOk()
    } catch (error) {
      toast.error('Chỉnh sửa nguyên liệu thất bại!')
    }
  }
  return (
    <Modal
      title='Chỉnh sửa loại nguyên liệu'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleUpdateIngredient}>
          Cập Nhật
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Tên'>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>

        <Form.Item name='imageUrl' label='Image'>
        {(previewImage || imageUrl) && (
    <img src={previewImage || imageUrl} alt='Ingredient' style={{ maxWidth: '100px' }} />
  )}
          <input type='file' onChange={handleFileChange} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalUpdateIngredientType
