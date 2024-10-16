import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  Id: string
  Email: string
  Name: string
  Role: string
}

const GetDataByToken = (token: string): any | null => {
  const decode = jwtDecode<JwtPayload>(token)
  const id = decode?.Id
  const email = decode?.Email
  const name = decode?.Name
  const role = decode?.Role

  return { id, email, name, role }
}
export default GetDataByToken
