export type AuthUser = {
  id: number
  login: string
}

export type LoginFormValues = {
  login: string
  password: string
}

export type AuthState = {
  token: string | null
  user: AuthUser | null
  status: 'idle' | 'loading' | 'authenticated' | 'guest'
  isBootstrapping: boolean
  errorMessage: string | null
}
