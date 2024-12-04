import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'
import AddIngredientRequest from '../Models/templateSteps'
// import { API_ENDPOINT } from '~/constants/api'

// import AddIngredientRequest from '~/Models/templateSteps'
const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getPreviewDetails = async () => {
  const response = await api.get('/TemplateStep')
  return response.data
}


export const createIngredientProduct = async (requestData: AddIngredientRequest) => {
  const response = await api.post('/TemplateStep', requestData)
  return response.data
}
export const updateTemplateStepById = async( {id, data}: {id: number, data: object}) =>{
  console.log(id)
  console.log("data", data)
  try {
    const response = await api.put(`/TemplateStep/${id}`, data, {
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