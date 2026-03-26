import { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../services/authService.js'
import { HttpError } from '../utils/httpError.js'

const getBearerToken = (request: Request) => {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null
  }

  return authorizationHeader.replace('Bearer ', '').trim()
}

export const requireAuth = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const accessToken = getBearerToken(request)

  if (!accessToken) {
    next(new HttpError(401, 'Требуется авторизация'))
    return
  }

  try {
    request.authenticatedUser = verifyAccessToken(accessToken)
    next()
  } catch (error) {
    next(error)
  }
}

export const attachOptionalUser = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const accessToken = getBearerToken(request)

  if (!accessToken) {
    next()
    return
  }

  try {
    request.authenticatedUser = verifyAccessToken(accessToken)
  } catch {
    request.authenticatedUser = undefined
  }

  next()
}
