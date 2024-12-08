import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, Form, Checkbox } from 'antd'
// import Category from '~/Models/categoryModel'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import { getCategoryById, updateCategoryById } from '../../../api/categoriesAPI'
import { getVoucherById, updateVoucherById } from '../../../api/voucherApi'

interface ModalUpdateIngredientTypeProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  voucherId: number
}

const ModalUpdateVoucher: React.FC<ModalUpdateIngredientTypeProps> = ({
  isOpen,
  handleOk,
  handleCancel,
  voucherId
}) => {
  const [code, setCode] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [expirationDate, setExpirationDate] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isStepRequired, setIsStepRequired] = useState(false)
  const [stepRequirement, setStepRequirement] = useState(0)
  const queryClient = useQueryClient()
  console.log(voucherId)
  useEffect(() => {
    if (!isOpen) setDataLoaded(false) // Reset cờ khi modal đóng
  }, [isOpen])
  const {
    isLoading: nutritionLoading,
    error: nutritionError,
    data: nutritionData
  } = useQuery(['voucher', voucherId], () => getVoucherById(voucherId), {
    enabled: isOpen && !!voucherId,
    onSuccess: (data: any) => {
      if (!dataLoaded) {
        setCode(data.data.code)
        setDiscountPercentage(data.data.discountPercentage)
        const date = new Date(data.data.expirationDate)
        setExpirationDate(date.toISOString().split('T')[0])
        setIsStepRequired(data.data.stepRequirement !== undefined)
        setStepRequirement(data.data.stepRequirement || 0)
      }
    }
  })
  console.log(nutritionData)
  const handleUpdateIngredient = async () => {
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
      formData.append('StepRequirement', stepRequirement.toString())
    }

    console.log(formData)
    try {
      await updateVoucherById({ id: voucherId, data: formData })
      await queryClient.invalidateQueries('voucher')
      toast.success('Chỉnh sửa mã giảm giá thành công!')
      handleOk()
    } catch (error) {
      toast.error('Chỉnh sửa mã giảm giá thất bại!')
    }
  }
  return (
    <Modal
      title='Chỉnh sửa mã giảm giá'
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
        <Form.Item>
          {isStepRequired && (
            <Form.Item label='Số bước chân'>
              {' '}
              // Thêm label cho input số bước chân
              <Input
                type='number'
                value={stepRequirement}
                onChange={(e) => setStepRequirement(Number(e.target.value))}
              />
            </Form.Item>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalUpdateVoucher
