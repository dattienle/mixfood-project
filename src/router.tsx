import { createBrowserRouter } from 'react-router-dom'
import App from '~/App'
import ErrorPage from '~/components/ErrorPage'
import CategoryPage from '~/pages/CategoryTable'
import Dashboard from '~/pages/Dashboard'
import IngredientApprovePage from '~/pages/IngredientTable/approve'
import IngredientNotApprovePage from '~/pages/IngredientTable/notApprove'
import NutritionPage from '~/pages/NutritionTable'
import ProductPage from '~/pages/ProductTable'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CategoryPage />
      },
      {
        
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
        path: 'dinh-duong',
        element: <NutritionPage />
      },
      {
        path: 'thuc-don',
        element: <ProductPage />
      },
      {
        path: 'doanh-thu',
        element: <Dashboard />
      }
    ]
  }
])
