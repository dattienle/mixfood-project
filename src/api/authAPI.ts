import axios from "axios";
import { API_ENDPOINT } from "~/constants/api";
import LoginType from "~/Models/loginModel";

const api = axios.create({
  baseURL: API_ENDPOINT
})
export const login = async (data: LoginType) => {
  try {
    console.log(data)
      const response = await api.post("/Account/Login",  {
        email: data.email,
        password: data.password
      } ,
      {
        headers: {
          'Content-Type': 'application/json'  // Đảm bảo định dạng JSON
   } })
      if (response && response.data) {
        console.log("login thanh cong")
        return response.data.data; // Assuming response.data contains the token and user info
      }else {
        // Trả về thông báo lỗi từ server (nếu có)
        throw new Error(response?.data?.message || 'Đăng nhập thất bại.'); 
      }
  }catch(error: any){
    throw error;
  }

}