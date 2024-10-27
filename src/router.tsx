import { syncBuiltinESMExports } from 'module'
import { createBrowserRouter, Outlet, useLocation, useNavigate } from 'react-router-dom'
import App from '~/App'
import LoginPage from '~/auth/Login'
import { Authentication } from '~/auth/protectedRoute'
import ErrorPage from '~/components/ErrorPage'
import CategoryPage from '~/pages/CategoryTable'
import ChatPage from '~/pages/Chat/chatPage'
import Dashboard from '~/pages/Dashboard'
import IngredientApprovePage from '~/pages/IngredientTable/approve'
import IngredientNotApprovePage from '~/pages/IngredientTable/notApprove'
import NutritionApprovePage from '~/pages/NutritionTable/approve'
import NutritionPage from '~/pages/NutritionTable/approve'
import NutritionNotApprovePage from '~/pages/NutritionTable/notApprove'
import ProductPage from '~/pages/ProductTable'

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
            path: 'dinh-duong-chua-duyet',
            element: <NutritionNotApprovePage />
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
