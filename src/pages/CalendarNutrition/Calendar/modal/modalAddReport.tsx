import React, { useState } from 'react'
import { Modal, Input, Button, Form, Select, Radio, Avatar } from 'antd'
import { toast } from 'react-toastify'
import { createReport } from '../../../../api/reportApi'
import { useQuery } from 'react-query'
import { getDish } from '../../../../api/dishAPI'
import Dish from '../../../../Models/DishModel'
import { getIngredients } from '../../../../api/ingredientApi'
import { getPreviewDetails } from '../../../../api/templateSteps'
import IngredientType from '../../../../Models/ingredientTypeModel'
import Ingredient from '../../../../Models/ingredientModel'
interface ModalAddCategoryProps {
  visible: boolean
  handleOk: (appointmentId: number) => void
  handleCancel: () => void
  appointmentId: number
}

const ModalAddReport: React.FC<ModalAddCategoryProps> = ({ visible, appointmentId, handleOk, handleCancel }) => {
  const [desciption, setDescription] = useState('')
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null)
  const [selectedIngredientType, setSelectedIngredientType] = useState<string | null>('')
  const [selectedIngredients, setSelectedIngredients] = useState<{ [key: string]: number[] }>({})
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string | null }>({})
  // Select dish
  const {
    isLoading,
    error,
    data: dishResponse
  } = useQuery('dish', getDish, {
    refetchOnMount: true
  })
  const handleChangeDish = (value: number) => {
    setSelectedDishId(value)
    setSelectedIngredientType('Tinh bột')
    console.log('dishId', value)
  }
  // ----------------------------
  // ++++++++ Lấy ra nguyên liệu từ cái selectedDishId-----------------
  const { data: ingredientDetail } = useQuery('ingredientDetail', getPreviewDetails)
  const dishData = ingredientDetail?.data.items.find((item: any) => item.dishId === selectedDishId)
  const ingredientType = dishData?.ingredientType
  // =========== Lấy ra nguyên liệu để so sánh với nguyên liệu được chọn => id gửi vào api
  const { data: ingredientResponse } = useQuery('ingredient', getIngredients, {
    refetchOnMount: true
  })

  // check min max
  const handleSelectIngredient = (id: number) => {
    const currentIngredientCount = selectedIngredients[selectedIngredientType || '']?.length || 0
    const min = ingredientType?.find((type: IngredientType) => type.name === selectedIngredientType)?.min
    const max = ingredientType?.find((type: IngredientType) => type.name === selectedIngredientType)?.max
    const effectiveMax = min === 0 && max === 0 ? 1 : max

    if (selectedIngredients[selectedIngredientType || '']?.includes(id)) {
      // Nếu đã chọn, bỏ chọn
      setSelectedIngredients((prev) => ({
        ...prev,
        [selectedIngredientType || '']: prev[selectedIngredientType || ''].filter((ingredientId) => ingredientId !== id)
      }))

      // Kiểm tra lại số lượng sau khi bỏ chọn
      const newCount = currentIngredientCount - 1 // Số lượng mới sau khi bỏ chọn
      if (newCount < min) {
        setErrorMessages((prev) => ({
          ...prev,
          [selectedIngredientType || '']:
            `Bạn cần chọn tối thiểu ${min} nguyên liệu cho loại ${selectedIngredientType}.`
        })) // Thông báo lỗi nếu chưa đủ min
      } else {
        setErrorMessages((prev) => ({ ...prev, [selectedIngredientType || '']: null })) // Xóa thông báo lỗi khi đủ
      }
    } else {
      // Nếu chưa chọn, kiểm tra số lượng
      if (currentIngredientCount < effectiveMax) {
        setSelectedIngredients((prev) => ({
          ...prev,
          [selectedIngredientType || '']: [...(prev[selectedIngredientType || ''] || []), id]
        }))
        setErrorMessages((prev) => ({ ...prev, [selectedIngredientType || '']: null })) // Xóa thông báo lỗi khi thêm thành công
      }

      // Kiểm tra số lượng hiện tại so với min
      if (currentIngredientCount + 1 < min) {
        setErrorMessages((prev) => ({
          ...prev,
          [selectedIngredientType || '']:
            `Bạn cần chọn tối thiểu ${min} nguyên liệu cho loại ${selectedIngredientType}.`
        })) // Thông báo lỗi nếu chưa đủ min
      }

      // Kiểm tra số lượng hiện tại so với max
      if (currentIngredientCount >= effectiveMax) {
        setErrorMessages((prev) => ({
          ...prev,
          [selectedIngredientType || '']:
            `Bạn chỉ có thể chọn tối đa ${effectiveMax} nguyên liệu cho loại ${selectedIngredientType}.`
        })) // Thông báo lỗi nếu vượt quá max
      }
    }
  }

  const handleChangeIngredientType = (value: string) => {
    setSelectedIngredientType(value)
    setErrorMessages((prev) => ({ ...prev, [value]: null })) // Xóa thông báo lỗi khi chuyển loại nguyên liệu
  }

  const handleAddReport = async () => {
    const formData = {
      appointmentId,
      description: desciption,
      dishId: selectedDishId,
      ingredientId: Object.values(selectedIngredients).flat() // Gửi mảng ingredientId
    }
    console.log('Dữ liệu gửi lên:', JSON.stringify(formData, null, 2))
    try {
      await createReport(formData)
      toast.success('Thêm báo cáo thành công!')
      handleOk(appointmentId)
    } catch (error) {
      toast.error('Thêm báo cáo thất bại!')
      console.error('Error adding nutrition:', error)
    }
  }
  return (
    <Modal
      title='Thêm mới báo cáo'
      open={visible}
      // onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleAddReport}>
          Thêm
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Mô Tả'>
          <Input.TextArea
            value={desciption}
            onChange={(e) => setDescription(e.target.value)}
            rows={4} // Số dòng hiển thị
            style={{ width: '100%' }} // Điều chỉnh chiều rộng ở đây
          />
        </Form.Item>
        <Form.Item label='Chọn món ăn'>
          {dishResponse ? (
            <Select placeholder='Chọn món ăn' onChange={handleChangeDish} value={selectedDishId}>
              {dishResponse.data.items.map((dish: Dish) => (
                <Select.Option key={dish.id} value={dish.id}>
                  {dish.name}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <div>Chưa có danh mục nào </div>
          )}
        </Form.Item>
        <Form.Item label='Chọn loại nguyên liệu'>
          <Radio.Group onChange={(e) => handleChangeIngredientType(e.target.value)} value={selectedIngredientType}>
            {ingredientType?.map((type: IngredientType) => (
              <Radio.Button key={type.id} value={type.name}>
                {type.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label='Chọn nguyên liệu'>
          <div>
            {selectedIngredientType &&
              ingredientType
                ?.find((type: IngredientType) => type.name === selectedIngredientType)
                ?.ingredient.map((ingredient: Ingredient) => (
                  <Avatar
                    key={ingredient.id}
                    src={ingredient.imageUrl}
                    size={64}
                    style={{ marginRight: '8px', marginBottom: '8px' }}
                    onClick={() => handleSelectIngredient(ingredient.id)}
                    className={
                      selectedIngredients[selectedIngredientType || '']?.includes(ingredient.id)
                        ? 'selected-ingredient'
                        : ''
                    }
                  />
                ))}
            {selectedIngredientType && (
              <div>
                <div>
                  Min: {ingredientType?.find((type: IngredientType) => type.name === selectedIngredientType)?.min} |
                  Max: {ingredientType?.find((type: IngredientType) => type.name === selectedIngredientType)?.max}
                </div>
              </div>
            )}
            {errorMessages[selectedIngredientType || ''] && (
              <div style={{ color: 'red' }}>{errorMessages[selectedIngredientType || '']}</div>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddReport
