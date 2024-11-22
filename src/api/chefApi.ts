import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'

const api = axios.create({
  baseURL: API_ENDPOINT
})
export const getOrderChef = async () => {
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.get('/Order', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
export const getOrderChefById = async (orderId: number) => {
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.get(`/Order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
export const updateStatusChef = async (orderId: number) => {
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.post('/Order/update-order-status',null, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { orderId }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
