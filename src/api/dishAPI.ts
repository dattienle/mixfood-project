import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'
// import { API_ENDPOINT } from '~/constants/api'
const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getDish = async () => {
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.get('/Dish', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const createDish = async (formData: FormData) => {
  try {
    const response = await api.post('/Dish', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
export const getDishById = async (id: number) => {
  try {
    const response = await api.get(`/Dish/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const getDishNameById = async (id: number) => {
  try {
    const response = await api.get(`/Dish/${id}`)
    return response.data.data.name
  } catch (error) {
    throw error
  }
}
export const updateDishById = async ({ id, data }: { id: number; data: FormData }) => {
  try {
    const response = await api.put(`/Dish/${id}`, data)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.error('Lỗi 400:', error.response.data) // In ra thông tin lỗi từ server
      // Hiển thị thông báo lỗi cho người dùng
    } else {
      throw error
    }
  }
}
export const updateStatusDish = async ({ id, isDelete }: { id: number; isDelete: boolean }) => {
  try {
    const response = await api.put(
      `/Dish/IsDelete/${id}`,
      { isDelete },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
