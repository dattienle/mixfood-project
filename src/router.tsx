import { createBrowserRouter } from 'react-router-dom'
import App from '~/App'
import ErrorPage from '~/components/ErrorPage'
import CategoryPage from '~/pages/CategoryTable'
import IngredientPage from '~/pages/IngredientTable'

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
        path: 'nguyen-lieu',
        element: <IngredientPage />
      },
      {
        path: 'danh-muc',
        element: <CategoryPage />
      }
    ]
  }
])
