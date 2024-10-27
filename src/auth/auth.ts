import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  Id: string
  Email: string
  Name: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
}

const GetDataByToken = (token: string): any | null => {
  const decode = jwtDecode<JwtPayload>(token)
  const id = decode?.Id
  const email = decode?.Email
  const name = decode?.Name
  const role = decode?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

  return { id, email, name, role }
}
export default GetDataByToken
