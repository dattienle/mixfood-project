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