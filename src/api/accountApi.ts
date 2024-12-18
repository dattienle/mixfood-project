import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'
const api = axios.create({
  baseURL: API_ENDPOINT
})
export const getAccount = async () => {
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.get('/Account',{
      headers: {
        'Authorization': `Bearer ${token}`,
     },
    })
    return response.data
  } catch (error) {
    throw error
  }
}
export const getAccountShipper = async () => {
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.get('/Account/Shipper',{
      headers: {
        'Authorization': `Bearer ${token}`,
     },
    })
    return response.data
  } catch (error) {
    throw error
  }
}
export const getAccountById = async(id: number ) =>{
  try {
    const response = await api.get(`/Account/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const updateStatusAccount = async ({ id, isDelete }: { id: number; isDelete: boolean }) => {
  try {
    const response = await api.put(
      `/Account/IsDelete/${id}`,
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
export const createAccount = async (data: FormData) => {
  try {
    const response = await api.post('/Account', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}