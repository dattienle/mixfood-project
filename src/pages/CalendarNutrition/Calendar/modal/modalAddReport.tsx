import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form, Select, Radio, Avatar, Tag, Tooltip } from 'antd'
import { toast } from 'react-toastify'
import { createReport } from '../../../../api/reportApi'
import { useQuery } from 'react-query'
import { getDish, getDishById, getDishNameById } from '../../../../api/dishAPI'
import Dish from '../../../../Models/DishModel'
import { getIngredients } from '../../../../api/ingredientApi'
import { getPreviewDetails } from '../../../../api/templateSteps'
import IngredientType from '../../../../Models/ingredientTypeModel'
import Ingredient from '../../../../Models/ingredientModel'
import { PlusOutlined } from '@ant-design/icons'
import './chat.scss'
import { getAppointment } from '../../../../api/calendarApi'
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
  const [visibleModal, setVisibleModal] = useState(false)
  const [totalCalories, setTotalCalories] = useState(0)
  const [dishes, setDishes] = useState<{ dishId: number; ingredientIds: number[]; name: string }[]>([])
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
    setSelectedIngredientType('Món chính')
    setSelectedIngredients({}) // Đặt lại nguyên liệu đã chọn
    setTotalCalories(0) // Đặt lại tổng calo
    setErrorMessages({})
    console.log('dishId', value)
  }
  // ----------------------------
  // ++++++++ Lấy ra nguyên liệu từ cái selectedDishId-----------------
  const { data: ingredientDetail } = useQuery('ingredientDetail', getPreviewDetails)
  const dishData = ingredientDetail?.data.items.find((item: any) => item.dishId === selectedDishId)
  const ingredientType = dishData?.ingredientType
  // =========== Lấy ra nguyên liệu để so sánh với nguyên liệu được ch���n => id gửi vào api
  const { data: ingredientResponse } = useQuery('ingredient', getIngredients, {
    refetchOnMount: true
  })

  // check min max
  const handleSelectIngredient = (id: number) => {
    const ingredient = ingredientResponse?.data.items.find((ing: Ingredient) => ing.id === id)
    const ingredientCalories = ingredient ? ingredient.calo : 0
    console.log(ingredientCalories)

    if (selectedIngredients[selectedIngredientType || '']?.includes(id)) {
      // Nếu đã chọn, bỏ chọn
      setSelectedIngredients((prev) => ({
        ...prev,
        [selectedIngredientType || '']: prev[selectedIngredientType || ''].filter((ingredientId) => ingredientId !== id)
      }))
      // Cập nhật lại tổng calo khi bỏ chọn
      setTotalCalories((prev) => prev - ingredientCalories)
    } else {
      // Nếu chưa chọn, thêm vào danh sách
      setSelectedIngredients((prev) => ({
        ...prev,
        [selectedIngredientType || '']: [...(prev[selectedIngredientType || ''] || []), id]
      }))
      // Cập nhật tổng calo khi thêm
      setTotalCalories((prev) => prev + ingredientCalories)
    }
  }
  const { data: appointmentResponse } = useQuery('appointment', getAppointment, {
    refetchOnMount: true,
    refetchInterval: 60000
  })
  console.log(appointmentId)
  console.log(appointmentResponse)
  const currentAppointment = appointmentResponse?.data?.find((item: any) => item.id === appointmentId)
  console.log(currentAppointment)
  const handleChangeIngredientType = (value: string) => {
    setSelectedIngredientType(value)
    setErrorMessages((prev) => ({ ...prev, [value]: null })) // Xóa thông báo lỗi khi chuyển loại nguyên liệu
  }
  useEffect(() => {
    console.log('Dishes:', dishes)
  }, [dishes])
  const handleAddReport = async () => {
    const formData = {
      appointmentId,
      description: desciption,
      dishes: dishes.map((dish) => ({
        dishId: dish.dishId,
        ingredientIds: dish.ingredientIds
      })) // Gửi mảng ingredientId
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
  const addNewDish = () => {
    // Mở modal để thêm món ăn
    setVisibleModal(true)
  }
  const handleAddDish = async (dishId: number, ingredientIds: number[]) => {
    if (dishId) {
      const dishName = await getDishNameById(dishId)

      setDishes((prev) => [...prev, { dishId, ingredientIds, name: dishName || 'Tên món ăn không tìm thấy' }])
      setVisibleModal(false) // Đóng modal sau khi thêm
      setSelectedDishId(null) // Reset lại dishId
      setSelectedIngredients({}) // Reset lại nguyên liệu
    }
  }
  const handleRemoveDish = (index: number) => {
    setDishes((prev) => prev.filter((_, i) => i !== index))
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
        <Form.Item label='Tình trạng sức khỏe'>
          {currentAppointment ? (
            <Input.TextArea
              value={currentAppointment.disease || 'Khách hàng sức khỏe bình thường'}
              rows={2}
              disabled
              style={{
                backgroundColor: currentAppointment.disease ? '#fff2f0' : '#f6ffed',  // Màu nền
                border: currentAppointment.disease ? '1px solid #ffccc7' : '1px solid #b7eb8f',  // Viền
                fontWeight: 'bold',
                color: currentAppointment.disease ? '#ff4d4f' : '#ff75c5',  // Đổi màu chữ sang hồng cho trường hợp khỏe mạnh
                fontSize: '14px'
              }}
            />
          ) : (
            <Input.TextArea value='Đang tải dữ liệu...' disabled rows={2} />
          )}
        </Form.Item>

        <Form.Item label='Dị ứng'>
          {currentAppointment ? (
            currentAppointment.allergy?.length > 0 ? (
              <div>
                {currentAppointment.allergy.map((allergyItem: any) => (
                  <Tag key={allergyItem.id} color='red'>
                    {allergyItem.name}
                  </Tag>
                ))}
              </div>
            ) : (
              <div>Không có dị ứng</div>
            )
          ) : (
            <div>Đang tải dữ liệu...</div>
          )}
        </Form.Item>
        <div>
          {dishes.map((dish, index) => (
            <Tag key={index} closable className='custom-tag' onClose={() => handleRemoveDish(index)}>
              {dish.name} {/* Hiển thị tên món ăn */}
            </Tag>
          ))}
        </div>
        <Button icon={<PlusOutlined />} onClick={addNewDish}>
          Thêm món ăn
        </Button>
        <Modal title='Thêm món ăn' open={visibleModal} onCancel={() => setVisibleModal(false)} footer={null}>
          <Form.Item label='Chọn món ăn' style={{ textAlign: 'start', fontWeight: '700' }}>
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
          <Form.Item label={<span className='custom-label'>Chọn loại nguyên liệu</span>} style={{ textAlign: 'start' }}>
            <Radio.Group onChange={(e) => handleChangeIngredientType(e.target.value)} value={selectedIngredientType}>
              {ingredientType?.map((type: IngredientType) => (
                <Radio.Button key={type.id} value={type.name}>
                  {type.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label={<span className='custom-label'>Chọn nguyên liệu</span>} style={{ textAlign: 'start' }}>
            <div className='select-ingredient'>
              {selectedIngredientType &&
                ingredientType
                  ?.find((type: IngredientType) => type.name === selectedIngredientType)
                  ?.ingredient.map((ingredient: Ingredient) => (
                    <Tooltip title={`${ingredient.name} - Calo: ${ingredient.calo}`} key={ingredient.id}>
                      <Avatar
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
                    </Tooltip>
                  ))}

              <div style={{ marginTop: '10px' }}>
                <strong>Tổng Calo:</strong> {totalCalories}
              </div>
            </div>
          </Form.Item>
          <Button onClick={() => handleAddDish(selectedDishId!, Object.values(selectedIngredients).flat())}>
            Thêm
          </Button>
        </Modal>
      </Form>
    </Modal>
  )
}

export default ModalAddReport
