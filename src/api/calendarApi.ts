import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'
const api = axios.create({
  baseURL: API_ENDPOINT
})
export const getFullCalendar = async () => {

  try {
    const response = await api.get('/ConsultationRequest')

    return response.data
  } catch (error) {
    throw error
  }
}
export const getAppointment = async () => {


  try {
    const response = await api.get('/Appointment')

    return response.data
  } catch (error) {
    throw error
  }
}
export const getCalendarByTime = async () => {
  try {
    const response = await api.get('/ConsultationRequest/TimePeriod')
    return response.data
  } catch (error) {
    throw error
  }
}
export const createCalendar = async (data: FormData) => {
  try {
    const response = await api.post('/Appointment', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const addMeetUrl = async (requestId: number, meetUrl: string) => {
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.post(
      '/Appointment',
      { requestId: requestId, meetUrl: meetUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
