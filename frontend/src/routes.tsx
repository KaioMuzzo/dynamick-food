import { createBrowserRouter } from 'react-router-dom'
import { RegisterDriverPage } from './features/auth/RegisterDriverPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RegisterDriverPage />,
  },
  {
    path: '/register/driver',
    element: <RegisterDriverPage />,
  },
])
