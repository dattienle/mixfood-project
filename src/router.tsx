import { syncBuiltinESMExports } from 'module'
import { createBrowserRouter, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Authentication } from './auth/protectedRoute'
import ErrorPage from './components/ErrorPage'
import App from './App'
import CategoryPage from './pages/CategoryTable'
import IngredientApprovePage from './pages/IngredientTable/approve'
import IngredientNotApprovePage from './pages/IngredientTable/notApprove'
import NutritionApprovePage from './pages/NutritionTable/approve'
import IngredientTypePage from './pages/IngredientTypeTable'
import ProductPage from './pages/ProductTable'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/Chat/chatPage'
import IngredientForNutritionist from './pages/IngredientNutritionist'
import LoginPage from './auth/Login'
import CalendarForStaff from './pages/Staff/Calendar'
import OrderPage from './pages/Staff/Order'
// import App from '~/App'
// import LoginPage from '~/auth/Login'
// import { Authentication } from '~/auth/protectedRoute'
// import ErrorPage from '~/components/ErrorPage'
// import CategoryPage from '~/pages/CategoryTable'
// import ChatPage from '~/pages/Chat/chatPage'
// import Dashboard from '~/pages/Dashboard'
// import IngredientForNutritionist from '~/pages/IngredientNutritionist'
// import IngredientApprovePage from '~/pages/IngredientTable/approve'
// import IngredientNotApprovePage from '~/pages/IngredientTable/notApprove'
// import IngredientTypePage from '~/pages/IngredientTypeTable'
// import NutritionApprovePage from '~/pages/NutritionTable/approve'
// import ProductPage from '~/pages/ProductTable'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Authentication />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/manager/dashboard',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <CategoryPage />
          },
          {
            path: 'nguyen-lieu-da-duyet',
            element: <IngredientApprovePage />
          },
          {
            path: 'nguyen-lieu-chua-duyet',
            element: <IngredientNotApprovePage />
          },
          {
            path: 'danh-muc',
            element: <CategoryPage />
          },
          {
            path: 'dinh-duong-da-duyet',
            element: <NutritionApprovePage />
          },
          {
            path: 'loai-nguyen-lieu',
            element: <IngredientTypePage />
          },
          {
            path: 'thuc-don',
            element: <ProductPage />
          }
        ]
      },
      {
        path: '/admin/dashboard',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: 'doanh-thu',
            element: <Dashboard />
          }
        ]
      },
      {
        path: '/nutritionist/dashboard',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <ChatPage />
          },
          {
            path: 'chat',
            element: <ChatPage />
          },
          {
            path: 'nguyen-lieu-chua-duyet',
            element: <IngredientForNutritionist />
          }
        ]
      },
      {
        path: '/staff/dashboard',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <CalendarForStaff />
          },
          {
            path: 'calendar',
            element: <CalendarForStaff />
          },
          {
            path: 'order',
            element:<OrderPage/>
          }
        
        ]
      }
    ]
  },

  {
    path: '/dang-nhap',
    element: <LoginPage />,
    errorElement: <ErrorPage />
  }
])
