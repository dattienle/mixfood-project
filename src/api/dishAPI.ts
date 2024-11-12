import axios from 'axios'
import { API_ENDPOINT } from '~/constants/api'
const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getDish = async () => {
  const response = await api.get('/Dish')
  return response.data
}


export const createDish = async (formData: FormData) => {
  try {
    const response = await api.post('/Dish', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};