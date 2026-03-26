import { PropsWithChildren, useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { store } from '@/app/store/store'
import {
  fetchCurrentUser,
  finishBootstrap,
  setStoredToken
} from '@/features/auth/model/authSlice'
import { router } from '@/router/router'
import { useAppDispatch } from '@/shared/hooks/redux'
import { getStoredAccessToken } from '@/shared/lib/storage'

const AuthBootstrapper = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch()
  const hasRestoredSession = useRef(false)

  useEffect(() => {
    if (hasRestoredSession.current) {
      return
    }

    hasRestoredSession.current = true

    const storedAccessToken = getStoredAccessToken()

    if (!storedAccessToken) {
      dispatch(finishBootstrap())
      return
    }

    dispatch(setStoredToken(storedAccessToken))
    void dispatch(fetchCurrentUser())
  }, [dispatch])

  return children
}

export const AppProviders = () => (
  <Provider store={store}>
    <AuthBootstrapper>
      <RouterProvider router={router} />
      <Toaster
        closeButton
        position="top-right"
        richColors
        toastOptions={{
          style: {
            borderRadius: '16px'
          }
        }}
      />
    </AuthBootstrapper>
  </Provider>
)
