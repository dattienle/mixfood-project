import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './style.scss'
import imageFile from '../../assets/image.png'
import LoginType from '~/Models/loginModel'
import { login } from '~/api/authAPI'
import GetDataByToken from '~/auth/auth'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { role } = GetDataByToken(token);

      switch (role) {
        case 'Manager':
          navigate('/manager/dashboard');
          break;
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        default:
          break; 
      }
    }
  }, [navigate]);
  const onFinish = async (values: LoginType) => {
    try {
      setLoading(true)
      const response = await login(values)
      if(!response&& !response.token){
        const errorMessage = response ? response.message : 'No response from server'
      throw new Error("Error: " + errorMessage)
      }
      localStorage.setItem('token', response.token)
      const {role} = GetDataByToken(response.token)
      toast.success('Đăng nhập thành công!');

  switch (role){
    case "Manager":
      navigate('/manager/dashboard')
      break;
      case "Admin":
      navigate('/admin/dashboard')
      break;
      default:
    console.error('Unknown role:', role);
    navigate('/dang-nhap');
  }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='logo-login'>
          <img src={imageFile} alt='Logo' />
        </div>
        <Form name='normal_login' className='login-form'  initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item name='email' rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
            <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Tên đăng nhập' />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Mật khẩu'
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <a className='login-form-forgot' href=''>
              Quên mật khẩu?
            </a>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='login-form-button' loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
