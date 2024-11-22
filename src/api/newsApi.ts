import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'


const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getNews = async () => {
  const response = await api.get('/News')
  return response.data
}
export const createNews = async (data: FormData) => {
  try {
    const response = await api.post('/News', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const getNewsById = async(id: number ) =>{
  try {
    const response = await api.get(`/News/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const updateNewsById = async( {id, data}: {id: number, data: FormData}) =>{
  try {
  const response = await api.put(`/News/${id}`, data)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.error("Lỗi 400:", error.response.data);
    } else {
      throw error
    }
  }
}
export const updateStatusNews = async ({ id, isDelete }: { id: number; isDelete: boolean }) => {
  try {
    const response = await api.put(
      `/News/IsDelete/${id}`,
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
