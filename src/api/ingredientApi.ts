import axios from 'axios'
import { API_ENDPOINT } from '~/constants/api'

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getIngredients = async () => {
  const response = await api.get('/Ingredient')
  return response.data
}

