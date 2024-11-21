import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'


const api = axios.create({
  baseURL: API_ENDPOINT
})
export const getOrderChef = async () => {
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.get('/Order', {
      headers: {
         'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }

}