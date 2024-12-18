import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'
import Category from '../Models/categoryModel'
// import { API_ENDPOINT } from '~/constants/api'
// import Category from '~/Models/categoryModel'

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getCategories = async () => {
  const response = await api.get('/Category')
  return response.data
}
export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/Category/${id}`)
  return response.data
}


export const createCategory = async (data: FormData) => {
  try {
    const response = await api.post('/Category', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const getCategoryById = async(id: number ) =>{
  try {
    const response = await api.get(`/Category/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const updateCategoryById = async( {id, data}: {id: number, data: FormData}) =>{
  try {
  const response = await api.put(`/Category/${id}`, data)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.error("Lỗi 400:", error.response.data);
    } else {
      throw error
    }
  }
}
export const updateStatusCategory = async ({ id, isDelete }: { id: number; isDelete: boolean }) => {
  try {
    const response = await api.put(
      `/Category/IsDelete/${id}`,
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
