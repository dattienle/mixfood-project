import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getDashboard = async (day: string, month: string) => {
  const response = await api.get(`/DashBoard?day=${day}&month=${month}`)
  return response.data
}
export const getDashboardYear = async (year: number) => {
  const response = await api.get(`/DashBoard/RevenueByYear/?year=${year}`)
  return response.data
}
