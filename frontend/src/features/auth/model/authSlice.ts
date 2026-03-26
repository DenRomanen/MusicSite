import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store/store'
import { getCurrentUserRequest, loginRequest } from '@/shared/api/auth'
import { getApiErrorMessage } from '@/shared/api/client'
import {
  getStoredAccessToken,
  removeStoredAccessToken,
  storeAccessToken
} from '@/shared/lib/storage'
import { AuthState, AuthUser, LoginFormValues } from './types'

const initialState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
  isBootstrapping: true,
  errorMessage: null
}

export const loginUser = createAsyncThunk<
  { token: string; user: AuthUser },
  LoginFormValues,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const authenticationResult = await loginRequest(credentials)
    storeAccessToken(authenticationResult.token)

    return authenticationResult
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

export const fetchCurrentUser = createAsyncThunk<
  AuthUser,
  void,
  { state: RootState; rejectValue: string }
>('auth/fetchCurrentUser', async (_, { getState, rejectWithValue }) => {
  const accessToken = getState().auth.token ?? getStoredAccessToken()

  if (!accessToken) {
    return rejectWithValue('Сессия отсутствует')
  }

  try {
    return await getCurrentUserRequest(accessToken)
  } catch (error) {
    removeStoredAccessToken()
    return rejectWithValue(getApiErrorMessage(error))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStoredToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.status = 'loading'
      state.errorMessage = null
    },
    finishBootstrap: (state) => {
      state.isBootstrapping = false
      state.status = state.user ? 'authenticated' : 'guest'
    },
    clearSession: (state) => {
      state.token = null
      state.user = null
      state.status = 'guest'
      state.isBootstrapping = false
      state.errorMessage = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.errorMessage = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.user = action.payload.user
        state.status = 'authenticated'
        state.isBootstrapping = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'guest'
        state.errorMessage = action.payload ?? 'Не удалось выполнить вход'
        state.isBootstrapping = false
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'authenticated'
        state.isBootstrapping = false
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.token = null
        state.user = null
        state.status = 'guest'
        state.errorMessage = action.payload ?? null
        state.isBootstrapping = false
      })
  }
})

export const { clearSession, finishBootstrap, setStoredToken } = authSlice.actions
export const authReducer = authSlice.reducer
