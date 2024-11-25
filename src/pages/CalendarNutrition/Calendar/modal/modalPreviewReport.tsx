import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Radio, Avatar, Typography } from 'antd'
import './previewReport.scss'
import { toast } from 'react-toastify'
import { createReport, getReport, getReportById } from '../../../../api/reportApi'
import { useQuery } from 'react-query'
import { getDish } from '../../../../api/dishAPI'
import Dish from '../../../../Models/DishModel'
import { getIngredients } from '../../../../api/ingredientApi'
import { getPreviewDetails } from '../../../../api/templateSteps'
import IngredientType from '../../../../Models/ingredientTypeModel'
import Ingredient from '../../../../Models/ingredientModel'
interface ModalAddCategoryProps {
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
  appointmentId: number
}

const ModalPreviewReport: React.FC<ModalAddCategoryProps> = ({ visible, appointmentId, handleOk, handleCancel }) => {
  const [desciption, setDescription] = useState('')
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null)
  const [selectedIngredientType, setSelectedIngredientType] = useState<string | null>('')
  const [selectedIngredients, setSelectedIngredients] = useState<{ [key: string]: number[] }>({})
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string | null }>({})
  const [reportData, setReportData] = useState<any>(null)
console.log(appointmentId)

const { data: reportResponse } = useQuery(['report', appointmentId], () => getReport(appointmentId!), {
  enabled: !!appointmentId, // Chỉ gọi khi currentAppointmentId có giá trị
  refetchOnMount: true,
  refetchInterval: 60000
})
console.log("reportResponse", reportResponse)

useEffect(() => {
  if (reportResponse) {
    setDescription(reportResponse.data.description);
    setSelectedDishId(reportResponse.data.dishConsultationReportResponse.dishId);
    const firstIngredientType = reportResponse.data.dishConsultationReportResponse.ingredientType[0]?.name;
      setSelectedIngredientType(firstIngredientType || null);
  }
}, [reportResponse]);



  return (
    <Modal
      title='Xem báo cáo'
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      className="custom-modal"
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>
      ]}
    >
      <Form layout='vertical'>
      <Form.Item label='Mô Tả'>
          <Typography.Text>{desciption}</Typography.Text>
        </Form.Item>
        <Form.Item label='Món ăn'>
        <Typography.Text>{reportResponse ? reportResponse.data.dishConsultationReportResponse.name : 'Chưa có món ăn nào'}</Typography.Text>
        </Form.Item>
        <Form.Item label='Loại nguyên liệu'>
          <Radio.Group  value={selectedIngredientType} onChange={(e) => setSelectedIngredientType(e.target.value)}>
            {reportResponse?.data.dishConsultationReportResponse.ingredientType?.map((type: IngredientType) => (
              <Radio.Button key={type.id} value={type.name}>
                {type.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label='Chọn nguyên liệu'>
        <div>
            {selectedIngredientType && reportResponse?.data.dishConsultationReportResponse.ingredientType
              ?.find((type: IngredientType) => type.name === selectedIngredientType)
              ?.ingredient.map((ingredient: Ingredient) => (
                <Avatar
                  key={ingredient.id}
                  src={ingredient.imageUrl}
                  size={64}
                  style={{ marginRight: '8px', marginBottom: '8px' }}
                />
              ))}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalPreviewReport
