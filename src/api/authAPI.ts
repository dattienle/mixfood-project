import axios from "axios";
import { API_ENDPOINT } from "~/constants/api";
import LoginType from "~/Models/loginModel";

const api = axios.create({
  baseURL: API_ENDPOINT
})
export const login = async (data: LoginType) => {
  try {
    console.log(data)
      const response = await api.post("/Authentication/login",  {
        email: data.email,
        password: data.password
      } ,
      {
        headers: {
          'Content-Type': 'application/json'  // Đảm bảo định dạng JSON
   } })
      if (response && response.data) {
        return response.data; // Assuming response.data contains the token and user info
      }
  }catch(error: any){
    console.log('Login failed: ', error.response ? error.response.data : error.message)
  }

}