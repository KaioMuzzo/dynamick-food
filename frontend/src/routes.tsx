import { createBrowserRouter } from 'react-router-dom'
import { WelcomePage } from './features/auth/WelcomePage'
import { RegisterDriverPage } from './features/auth/RegisterDriverPage'
import { SystemErrorPage } from './features/errors/SystemErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
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
