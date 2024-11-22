import React, { useState } from 'react'
import { Modal, Input, Button, Form, Select } from 'antd'

import { toast } from 'react-toastify'
import { createAccount } from '../../../../api/accountApi'
interface ModalAddAccountProps {
  isOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

const ModalAddAccount: React.FC<ModalAddAccountProps> = ({ isOpen, handleOk, handleCancel }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const handlePhoneChange = (value: string) => {
    // Chỉ cho phép nhập số
    const numericValue = value.replace(/[^0-9]/g, '');
    setPhone(numericValue);
  };

  const handleAddAccount = async () => {

    if(!email || !name || !password || !phone || !roleId){
      toast.error("Vui lòng nhập đủ thông tin")
      return
    }
    if (phone.length !== 10) {
      toast.error("Số điện thoại phải có 10 số");
      return;
    }
    const accountData = {
      email,
      password,
      name,
      phone,
      roleId
    }
    console.log('Dữ liệu gửi đi:', accountData);
    try {
      await createAccount(accountData)
      toast.success('Thêm tài khoản thành công!')
      handleOk()
    } catch (error) {
      toast.error('Thêm tài khoản thất bại!')
      console.error('Error adding nutrition:', error)
    }
  }
  return (
    <Modal
    title='Thêm Tài Khoản Mới'
    open={isOpen}
    onOk={handleOk}
    onCancel={handleCancel}
    centered
    footer={[
      <Button key='cancel' onClick={handleCancel}>
        Hủy
      </Button>,
      <Button key='submit' type='primary' onClick={handleAddAccount}>
        Thêm
      </Button>
    ]}
  >
    <Form layout='vertical'>
      <Form.Item label='Email'>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>
      <Form.Item label='Mật khẩu'>
        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>
      <Form.Item label='Tên'>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Item>
      <Form.Item label='Số điện thoại'>
        <Input type='tel' value={phone} onChange={(e) => handlePhoneChange(e.target.value)} />
      </Form.Item>
      <Form.Item label='Vai trò'>
          <Select value={roleId} onChange={(value) => setRoleId(value)} placeholder="Chọn vai trò">
            <Select.Option value={1}>Admin</Select.Option>
            <Select.Option value={2}>Manager</Select.Option>
            <Select.Option value={3}>Staff</Select.Option>
            <Select.Option value={4}>Shipper</Select.Option>
            <Select.Option value={5}>Customer</Select.Option>
            <Select.Option value={6}>Nutritionist</Select.Option>
            <Select.Option value={7}>Chef</Select.Option>
          </Select>
        </Form.Item>
    </Form>
  </Modal>
  )
}

export default ModalAddAccount
