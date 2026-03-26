import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  authenticateUser,
  createAccessToken,
  getCurrentUser
} from '../services/authService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/httpError.js'

export const authRouter = Router()

authRouter.post(
  '/login',
  asyncHandler(async (request, response) => {
    const { login, password } = request.body as {
      login?: string
      password?: string
    }

    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new HttpError(400, 'Логин и пароль обязательны')
    }

    const authenticatedUser = await authenticateUser(login, password)

    response.json({
      token: createAccessToken(authenticatedUser),
      user: authenticatedUser
    })
  }),
)

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (request, response) => {
    response.json(getCurrentUser(request.authenticatedUser!.id))
  }),
)
