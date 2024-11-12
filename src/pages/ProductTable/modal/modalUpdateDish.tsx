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
} from 'antd'
import Category from '~/Models/categoryModel'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'
import { getCategories } from '~/api/categoriesAPI'
import { getIngredientType } from '~/api/ingredientTypeApi'

interface ModalUpdateProductProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  // handleChange: (value: string, key: keyof ProductTemplate) => void;
  // formValues: ProductTemplate;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
const ModalUpdateProduct: React.FC<ModalUpdateProductProps> = ({
  isOpen,
  handleOk,
  handleCancel
  // handleChange,
  // formValues
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Giới hạn số lượng file upload là 1
    if (newFileList.length > 1) {
      message.warning('Bạn chỉ được upload tối đa 1 ảnh!')
      return
    }
    setFileList(newFileList)
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  // Call api category để selected
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { isLoading, error, data: categories } = useQuery('categories', getCategories)

  const {
    // isLoading: isLoadingIngredientType,
    // error: errorIngredientType,
    data: ingredientType
  } = useQuery('ingredientType', getIngredientType)
  console.log(ingredientType)
  if (isLoading) {
    return <Spin size='large' />
  }

  if (error) {
    return <div>Lỗi</div>
  }

  const handleChangeCategory = (value: string) => {
    setSelectedCategory(value)
  }
  
  return (
    <Modal
      title='Chỉnh sửa món ăn'
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
        <Form.Item label='Tên món ăn'>
          <Input
            placeholder='Nhập tên món ăn'
            // value={formValues.name}
            // onChange={e => handleChange(e.target.value, 'name')}
          />
        </Form.Item>

        <Form.Item label='Ảnh'>
          <Upload
            // action để kết nối BE POST Image
            action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
            listType='picture-circle'
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            showUploadList={true}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage('')
              }}
              src={previewImage}
            />
          )}
        </Form.Item>
        <Form.Item label='Giá'>
          <InputNumber
            placeholder='Nhập giá'
            // value={formValues.price}
            // onChange={value => handleChange(value, 'price')}
          />
        </Form.Item>
      
        <Form.Item label='Chọn danh mục'>
          {categories ? (
            <Select placeholder='Chọn danh mục' onChange={handleChangeCategory} value={selectedCategory}>
              {categories.data.items.map((category: Category) => (
                <Select.Option key={category.id} value={category.name}>
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

export default ModalUpdateProduct
