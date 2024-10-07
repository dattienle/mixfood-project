import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'

import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { router } from '~/router.tsx'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
     <StrictMode>
    <RouterProvider router={router} />

  </StrictMode>
  </QueryClientProvider>
 
)
