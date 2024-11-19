import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'
// import { API_ENDPOINT } from '~/constants/api'

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getIngredientType = async () => {
  const response = await api.get('/IngredientType')
  return response.data
}
export const getIngredientTypeById = async(id: number ) =>{
  try {
    const response = await api.get(`/IngredientType/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const addIngredientType = async(data: FormData) =>{
  try{
    const response = await api.post('/IngredientType', data)
    return response.data
  }catch(error){
    throw error
  }
}
export const updateIngredientTypeById = async( {id, data}: {id: number, data: FormData}) =>{
  try {
  const response = await api.put(`/IngredientType/${id}`, data)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.error("Lỗi 400:", error.response.data);
    } else {
      throw error
    }
  }
}
export const updateStatusIngredientType= async ({ id, isDeleted }: { id: number; isDeleted: boolean }) => {
  try {
    const response = await api.put(
      `/IngredientType/${id}`,
      { isDeleted },
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