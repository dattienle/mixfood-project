import axios from "axios";
import { API_ENDPOINT } from "../constants/api";

// import { API_ENDPOINT } from "~/constants/api";

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getNutrition = async () => {
  const response = await api.get('/Nutrition')
  return response.data
}

export const createNutrition = async (formData: FormData) => {
  try {
    const response = await api.post('/Nutrition', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getNutritionById = async(id: number ) =>{
  try {
    const response = await api.get(`/Nutrition/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const updateNutritionById = async( {id, data}: {id: number, data: FormData}) =>{
  try {
  const response = await api.put(`/Nutrition/${id}`, data)
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
export const updateStatusNutrition = async ({ id, isDelete }: { id: number; isDelete: boolean }) => {
  try {
    const response = await api.put(
      `/Nutrition/IsDelete/${id}`,
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
