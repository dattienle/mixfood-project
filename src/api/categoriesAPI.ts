import axios from 'axios'
import { API_ENDPOINT } from '~/constants/api'
import Category from '~/Models/categoryModel'

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getCategories = async () => {
  const response = await api.get<Category[]>('/Category')
  return response.data
}