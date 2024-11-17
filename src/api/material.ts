import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'
// import { API_ENDPOINT } from '~/constants/api'

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getMaterial = async () => {
  const response = await api.get('/Material')
  return response.data
}
export const createMaterial = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/Material', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}