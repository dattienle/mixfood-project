import React, { useState } from 'react'
import { Modal, Input, Button, Form, Radio, Checkbox } from 'antd'
import Category from '../../../Models/categoryModel'
import { createCategory } from '../../../api/categoriesAPI'
import { toast } from 'react-toastify'
import { createVoucher } from '../../../api/voucherApi'
interface ModalAddCategoryProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

const ModalAddVoucher: React.FC<ModalAddCategoryProps> = ({ isOpen, handleOk, handleCancel }) => {
  const [code, setCode] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [expirationDate, setExpirationDate] = useState('')
  const [isStepRequired, setIsStepRequired] = useState(false) // Thêm state cho radio

  const [stepRequirement, setStepRequirement] = useState(0)

  const handleAddCategory = async () => {
    const formData = new FormData()
    console.log(code, discountPercentage, expirationDate)
    if (!code || !discountPercentage || !expirationDate) {
      toast.error('Vui lòng điền đủ thông tin ')
      return
    }
    formData.append('Code', code)
    formData.append('DiscountPercentage', discountPercentage.toString())
    const isoExpirationDate = new Date(expirationDate).toISOString()
    formData.append('ExpirationDate', isoExpirationDate)
    if (isStepRequired) {
      formData.append('StepRequirement', stepRequirement.toString()) // Thêm số bước chân vào formData nếu được chọn
    }
    console.log(formData)
    try {
      await createVoucher(formData)
      toast.success('Thêm mã giảm giá thành công!')
      handleOk()
    } catch (error) {
      toast.error('Thêm mã giảm giá thất bại!')
      console.error('Error adding nutrition:', error)
    }
  }
  return (
    <Modal
      title='Thêm mới mã giảm giá'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleAddCategory}>
          Add
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Mã'>
          <Input value={code} onChange={(e) => setCode(e.target.value)} />
        </Form.Item>
        <Form.Item label='Phần trăm giảm giá'>
          <Input
            type='number'
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
          />
        </Form.Item>
        <Form.Item label='Ngày hết hạn'>
          <Input type='date' value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
        </Form.Item>
        <Form.Item label='Mã giảm giá bước chân'>
          <Checkbox onChange={(e) => setIsStepRequired(e.target.checked)} checked={isStepRequired}>
            Yêu cầu số bước chân
          </Checkbox>
          {isStepRequired && (
            <Input
              type='number'
              placeholder='Nhập số bước chân yêu cầu'
              onChange={(e) => setStepRequirement(Number(e.target.value))}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddVoucher
