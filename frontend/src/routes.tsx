import { createBrowserRouter } from 'react-router-dom'
import { WelcomePage } from './features/auth/WelcomePage'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterDriverPage } from './features/auth/RegisterDriverPage'
import { SystemErrorPage } from './features/errors/SystemErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register/driver',
    element: <RegisterDriverPage />,
  },
  {
    path: '/system-error',
    element: <SystemErrorPage />,
  },
])
