import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'
// import Category from '~/Models/categoryModel'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import { getCategoryById, updateCategoryById } from '../../../api/categoriesAPI'
import { getNewsById, updateNewsById } from '../../../api/newsApi'

interface ModalUpdateIngredientTypeProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  newsId: number
}

const ModalUpdateNews: React.FC<ModalUpdateIngredientTypeProps> = ({
  isOpen,
  handleOk,
  handleCancel,
  newsId
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [imageUrl, setImageUrl] = useState('')
  const queryClient = useQueryClient()
  const [dataLoaded, setDataLoaded] = useState(false)
  useEffect(() => {
    if (!isOpen) setDataLoaded(false) // Reset cờ khi modal đóng
  }, [isOpen])
  const {
    isLoading: nutritionLoading,
    error: nutritionError,
    data: nutritionData
  } = useQuery(['ingredientType', newsId], () => getNewsById(newsId), {
    enabled: isOpen && !!newsId,
    onSuccess: (data: any) => {
      if (!dataLoaded) {
        setTitle(data.data.title)
        setDescription(data.data.description)
        setImageUrl(data.data.imageUrl)
        setDataLoaded(true)
      }
    }
  })

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
    formData.append('Title', title)
    formData.append('Description', description)

    if (fileList) {
      formData.append('ImageUrl', fileList)
    }

    try {
      await updateNewsById({ id: newsId, data: formData })
      await queryClient.invalidateQueries('ingredient')
      toast.success('Chỉnh sửa tin tức thành công!')
      handleOk()
    } catch (error) {
      toast.error('Chỉnh sửa tin tức thất bại!')
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
        <Form.Item label='Tiêu Đề'>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>
        <Form.Item label='Mô Tả'>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
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

export default ModalUpdateNews
