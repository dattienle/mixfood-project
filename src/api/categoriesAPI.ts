import axios from 'axios'
import { API_ENDPOINT } from '~/constants/api'
import Category from '~/Models/categoryModel'

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

export const updateCategory = async (id: number, name: string) => {
  const response = await api.put(`/Category/${id}`, { name })
  return response.data
}

export const createCategory = async (data: Category) => {
  const response = await api.post('/Category', data)
  return response.data
}
export const updateStatusCategory = async (id: number) => {
  try {
    const response = await api.put(`/Category/Status/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
