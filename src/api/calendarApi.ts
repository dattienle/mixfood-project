import axios from "axios";
import { API_ENDPOINT } from "../constants/api";
const api = axios.create({
  baseURL: API_ENDPOINT
})
export const getFullCalendar = async () => {
  const token = sessionStorage.getItem('token')

  try {
    const response = await api.get('/ConsultationRequest');
   
    return response.data;
    
  } catch (error) {
    throw error;
  }
}
export const getCalendarByTime = async( ) =>{
  try {
    const response = await api.get('/ConsultationRequest/TimePeriod')
    return response.data
  } catch (error) {
    throw error
  }
}