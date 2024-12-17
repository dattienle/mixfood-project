import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Form, Select, Checkbox } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import { getPackageById, getSubPackage, updatePackageById } from '../../../api/packageApi'
import { SubPackage } from '../../../Models/packageModel'

interface ModalAddIngredientTypeProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  packageId: number
}

const ModalUpdatePackage: React.FC<ModalAddIngredientTypeProps> = ({ isOpen, handleOk, handleCancel, packageId }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [subPackageId, setSubPackageId] = useState<number[]>([])
  const queryClient = useQueryClient()
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (!isOpen) setDataLoaded(false) // Reset cờ khi modal đóng
  }, [isOpen])
  const {
    isLoading: packageLoading,
    error: packageError,
    data: packageResponse
  } = useQuery(['package', packageId], () => getPackageById(packageId), {
    enabled: isOpen && !!packageId,
    onSuccess: (data: any) => {
      console.log('packageResponse', packageResponse)
      if (!dataLoaded) {
        setTitle(data.data.title)
        setDescription(data.data.description)
        setPrice(data.data.price)
        const subPackageIds = data.data.subPackage.map((pkg: any) => pkg.id)
        setSubPackageId(subPackageIds)
      }
    }
  })
  const { data: subPackages = [], isLoading } = useQuery('subpackages', getSubPackage, {
    refetchOnMount: true
  })
  console.log('Subpackage', subPackages)
  const subPackageData = subPackages?.data?.items || []

  const handleUpdatePackage = async () => {
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
      await updatePackageById({ id: packageId, data: formData })
      await queryClient.invalidateQueries('ingredient')
      toast.success('Cập nhật gói thành công!')
      handleOk()
    } catch (error) {
      toast.error('Cập nhật gói thất bại!')
    }
  }
  const handleSubPackageChange = (checkedValues: any) => {
    setSubPackageId(checkedValues)
  }
  return (
    <Modal
      title='Chỉnh sửa gói'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={handleUpdatePackage}>
          Chỉnh sửa
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
          <Input type='number' min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
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

export default ModalUpdatePackage
