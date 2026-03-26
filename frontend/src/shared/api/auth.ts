import { AuthUser, LoginFormValues } from '@/features/auth/model/types'
import { apiRequest } from '@/shared/api/client'

type LoginResponse = {
  token: string
  user: AuthUser
}

export const loginRequest = (credentials: LoginFormValues) =>
  apiRequest<LoginResponse>('/auth/login', {
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })

export const getCurrentUserRequest = (token: string) =>
  apiRequest<AuthUser>('/auth/me', {
    method: 'GET',
    token
  })
