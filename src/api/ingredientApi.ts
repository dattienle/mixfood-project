import axios from 'axios'
import { API_ENDPOINT } from '~/constants/api'

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getIngredients = async () => {
  const response = await api.get('/Ingredient')
  return response.data
}
export const approvedIngredient = async ({ id, isApproved }: { id: number; isApproved: boolean }) =>{
  try {
    const response = await api.put(
      `/Ingredient/${id}`,
      { isApproved },
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
export const updateStatusIngredient = async ({ id, isDelete }: { id: number; isDelete: boolean }) => {
  try {
    const response = await api.put(
      `/Ingredient/IsDelete/${id}`,
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
export const addIngredient = async(data: FormData) =>{
try{
  const response = await api.post('/Ingredient', data)
  return response.data
}catch(error){
  throw error
}
}
export const getIngredientById = async(id: number ) =>{
  try {
    const response = await api.get(`/Ingredient/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const updateIngredientById = async( {id, data}: {id: number, data: FormData}) =>{
  try {
  const response = await api.put(`/Ingredient/${id}`, data)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.error("Lỗi 400:", error.response.data); // In ra thông tin lỗi từ server
      // Hiển thị thông báo lỗi cho người dùng
    } else {
      throw error
    }
  }
}