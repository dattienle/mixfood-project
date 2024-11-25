import axios from 'axios'
import { API_ENDPOINT } from '../constants/api'
// import { API_ENDPOINT } from '~/constants/api'

const api = axios.create({
  baseURL: API_ENDPOINT
})

export const getPackage = async () => {
  const response = await api.get('/Package')
  return response.data
}
export const getSubPackage = async () => {
  const response = await api.get('/Package/SubPackage')
  return response.data
}
export const getPackageById = async(id: number ) =>{
  try {
    const response = await api.get(`/Package/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const addPackage = async (data: object) => {
  try {
    const response = await api.post('/Package', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const updatePackageById = async( {id, data}: {id: number, data: object}) =>{
  try {
    const response = await api.put(`/Package/${id}`, data, {
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
// export const updateStatusIngredientType= async ({ id, isDeleted }: { id: number; isDeleted: boolean }) => {
//   try {
//     const response = await api.put(
//       `/IngredientType/${id}`,
//       { isDeleted },
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     )
//     return response.data
//   } catch (error) {
//     throw error
//   }
// }