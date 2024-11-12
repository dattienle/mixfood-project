import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import React from 'react'
import { Outlet } from 'react-router-dom'
// import Sidebar from '~/components/Sidebar'
import './App.scss'
import logo from './assets/image.png'
// import Navbar from '~/components/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

export default function App() {
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
    backgroundColor: '#fff'
  }

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 1,
    width: 'calc(100% - 250px)',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0 20px',
    backgroundColor: '#fff'
  }

  return (
    <Layout>
      <ToastContainer style={{ zIndex: 9999 }} />
      <Sider width={250} style={siderStyle}>
        <div className='logo'>
          <img src={logo} alt='Logo' />
        </div>
        <Sidebar />
      </Sider>

      <Layout style={{ marginLeft: 250 }}>
        <Header style={headerStyle}>
          <Navbar />
        </Header>
        <Layout style={{ padding: '24px', marginTop: 64 }}>
          <div className='content'>
            <Outlet />
          </div>
        </Layout>
      </Layout>
    </Layout>
  )
}
