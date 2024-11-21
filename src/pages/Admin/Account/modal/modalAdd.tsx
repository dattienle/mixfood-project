import React, { useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'

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
  const [address,setAddress] = useState('')

  const handlePhoneChange = (value: string) => {
    // Chỉ cho phép nhập số
    const numericValue = value.replace(/[^0-9]/g, '');
    setPhone(numericValue);
  };

  const handleAddAccount = async () => {

    if(!email || !name || !password || !phone || !address){
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
      address
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
      <Form.Item label='Địa chỉ'>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </Form.Item>

    </Form>
  </Modal>
  )
}

export default ModalAddAccount
