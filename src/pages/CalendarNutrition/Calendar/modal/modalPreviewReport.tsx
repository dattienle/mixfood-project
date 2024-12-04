import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Radio, Avatar, Typography, Collapse } from 'antd'
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
  

const { data: reportResponse } = useQuery(['report', appointmentId], () => getReport(appointmentId!), {
  enabled: !!appointmentId, // Chỉ gọi khi currentAppointmentId có giá trị
  refetchOnMount: true,
  refetchInterval: 60000
})
console.log("reportResponse", reportResponse)

useEffect(() => {
  if (reportResponse) {
    setDescription(reportResponse.data.description);
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
      style={{ maxHeight: '70vh', overflowY: 'auto' }} 
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
        <Collapse>
          {reportResponse ? reportResponse.data.dishConsultationReportResponse.map((dish: any) => (
            <Collapse.Panel header={dish.name} key={dish.id}>
              <div>
                {dish.ingredientType.map((type: any) => (
                  <div key={type.id}>
                    <Typography.Text>{type.name}:</Typography.Text>
                    <div>
                      {type.ingredient.map((ingredient: Ingredient) => (
                        <Avatar
                          key={ingredient.id}
                          src={ingredient.imageUrl}
                          size={64}
                          style={{ marginRight: '8px', marginBottom: '8px' }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Collapse.Panel>
          )) : 'Chưa có món ăn nào'}
        </Collapse>
      </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalPreviewReport
