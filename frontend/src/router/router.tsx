import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { HomePage } from '@/pages/home/HomePage'
import { LoginPage } from '@/pages/login/LoginPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
])
