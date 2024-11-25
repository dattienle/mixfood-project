import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Form, Select, Checkbox } from 'antd'
// import Category from '~/Models/categoryModel'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { addIngredientType } from '../../../api/ingredientTypeApi'
import { addPackage, getSubPackage } from '../../../api/packageApi'
import { SubPackage } from '../../../Models/packageModel'
// import { addIngredientType } from '~/api/ingredientTypeApi'

interface ModalAddIngredientTypeProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

const ModalAddPackage: React.FC<ModalAddIngredientTypeProps> = ({ isOpen, handleOk, handleCancel }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [subPackageId, setSubPackageId] = useState<number[]>([])
  const queryClient = useQueryClient()

  const { data: subPackageResponse =[], isLoading, isError } = useQuery('subpackages', getSubPackage, {
    refetchOnMount: true
  })
  if (isError) {
    toast.error('Lỗi khi lấy dữ liệu subpackage!');
  }
  console.log(subPackageResponse)
  const subPackageData = subPackageResponse?.data?.items || [];

  const handleAddPackage = async () => {
    if (!title || !description || price <= 0 || subPackageId.length === 0) {
      toast.error('Vui lòng nhập đủ thông tin gói')
      return
    }
    const formData = {
      title: title,
      description: description,
      price: price,
      subPackageId: subPackageId
    }

    try {
      await addPackage(formData)
      await queryClient.invalidateQueries('ingredient')
      toast.success('Thêm gói thành công!')
      handleOk()
    } catch (error) {
      toast.error('Thêm gói thất bại!')
    }
  }
  const handleSubPackageChange = (checkedValues: any) => {
    setSubPackageId(checkedValues)
  }
  return (
    <Modal
      title='Thêm mới gói'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleAddPackage}>
          Thêm
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Form.Item label='Tên'>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>
        <Form.Item label='Mô tả'>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item label='Giá'>
          <Input type='number' value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </Form.Item>
        <Form.Item label='Chọn Subpackage'>
          <Checkbox.Group value={subPackageId} onChange={handleSubPackageChange}>
            {subPackageData.map((pkg: SubPackage) => (
              <Checkbox key={pkg.id} value={pkg.id}>
                {pkg.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddPackage
