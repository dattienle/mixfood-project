import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import GetDataByToken from './auth'
// import GetDataByToken from '~/auth/auth'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = sessionStorage.getItem('token')
  if (!token) {
    return <Navigate to='/dang-nhap' replace />
  }

  return <>{children}</>
}

export const Authentication: React.FC = () => {
  const token = sessionStorage.getItem('token')
  const location = useLocation()
  const navigate = useNavigate()

  if (!token && location.pathname !== '/dang-nhap') {
    return <Navigate to='/dang-nhap' replace />
  }

  useEffect(() => {
    const checkRole = async () => {
      if (token) {
        const data = await GetDataByToken(token)
        if (!data) {
          navigate('/dang-nhap')
          return
        }
        const { role } = data
        switch (role) {
          case 'Manager':
            if (!location.pathname.startsWith('/manager/dashboard')) {
              navigate('/manager/dashboard')
            }
            break
          case 'Admin':
            if (!location.pathname.startsWith('/admin/dashboard')) {
              navigate('/admin/dashboard')
            }
            break
          case 'Nutritionist':
            if (!location.pathname.startsWith('/nutritionist/dashboard')) {
              navigate('/nutritionist/dashboard')
            }
            break
          default:
            navigate('/dang-nhap')
        }
      }
    }
  }, [token, location, navigate])

  return <Outlet />
}
