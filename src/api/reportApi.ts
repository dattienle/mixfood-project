import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'
// import { API_ENDPOINT } from "~/constants/api"

const api = axios.create({
  baseURL: API_ENDPOINT
})
export const getReport = async (appointmentId: number) => {
  try {
    const response = await api.get('/ConsultationReport',{
      params: { appointmentId }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const createReport = async (data: object) => {
  try {
    const response = await api.post('/ConsultationReport', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
export const getReportById = async(id: number ) =>{
  try {
    const response = await api.get(`/ConsultationReport/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const updateReportById = async( {id, data}: {id: number, data: object}) =>{
  try {
    const response = await api.put(`/ConsultationReport/${id}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.error("Lỗi 400:", error.response.data);
    } else {
      throw error
    }
  }
}