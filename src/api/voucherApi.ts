import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'


const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getVoucher = async () => {
  const response = await api.get('/Voucher')
  return response.data
}
export const deleteVoucher = async (id: number) => {
  const response = await api.delete(`/Voucher/${id}`)
  return response.data
}


export const createVoucher = async (data: FormData) => {
  try {
    const response = await api.post('/Voucher', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const getVoucherById = async(id: number ) =>{
  try {
    const response = await api.get(`/Voucher/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const updateVoucherById = async( {id, data}: {id: number, data: FormData}) =>{
  try {
  const response = await api.put(`/Voucher/${id}`, data)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.error("Lỗi 400:", error.response.data);
    } else {
      throw error
    }
  }
}
export const updateStatusVoucher = async ({ id, isDelete }: { id: number; isDelete: boolean }) => {
  try {
    const response = await api.put(
      `/Voucher/IsDelete/${id}`,
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
