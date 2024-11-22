import axios from "axios";
import { API_ENDPOINT } from "../constants/api";

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getOrder = async () => {
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
export const getOrderById = async(id: number ) =>{
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.get(`/Order/${id}`, {
      headers: {
         'Authorization': `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}
export const chooseShipper = async (orderId: number, idShipper: number) => {
  const token = sessionStorage.getItem('token')
  try {
    const response = await api.post('/Order/update-order-status',null, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { orderId, idShipper }
    })
    return response.data
  } catch (error) {
    throw error
  }
}