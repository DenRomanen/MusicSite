import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from '../config/env.js'
import { query } from '../db/database.js'
import { HttpError } from '../utils/httpError.js'

type UserRow = {
  id: number
  login: string
  password_hash: string
}

export type AuthenticatedUser = {
  id: number
  login: string
}

const toAuthenticatedUser = (userRow: Pick<UserRow, 'id' | 'login'>) => ({
  id: userRow.id,
  login: userRow.login
})

const findUserByLogin = async (login: string) => {
  const result = await query<UserRow>(
    'SELECT id, login, password_hash FROM users WHERE login = $1 LIMIT 1',
    [login],
  )

  return result.rows[0]
}

const findUserById = async (userId: number) => {
  const result = await query<UserRow>(
    'SELECT id, login, password_hash FROM users WHERE id = $1 LIMIT 1',
    [userId],
  )

  return result.rows[0]
}

export const ensureAdminUser = async () => {
  const existingAdmin = await findUserByLogin(env.adminLogin)

  if (existingAdmin) {
    return false
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 10)

  await query('INSERT INTO users (login, password_hash) VALUES ($1, $2)', [
    env.adminLogin,
    passwordHash
  ])

  return true
}

export const authenticateUser = async (
  login: string,
  password: string,
): Promise<AuthenticatedUser> => {
  const sanitizedLogin = login.trim()
  const sanitizedPassword = password.trim()

  if (!sanitizedLogin || !sanitizedPassword) {
    throw new HttpError(400, 'Логин и пароль обязательны')
  }

  const userRow = await findUserByLogin(sanitizedLogin)

  if (!userRow) {
    throw new HttpError(401, 'Неверный логин или пароль')
  }

  const passwordMatches = await bcrypt.compare(
    sanitizedPassword,
    userRow.password_hash,
  )

  if (!passwordMatches) {
    throw new HttpError(401, 'Неверный логин или пароль')
  }

  return toAuthenticatedUser(userRow)
}

export const createAccessToken = (authenticatedUser: AuthenticatedUser) =>
  jwt.sign(authenticatedUser, env.jwtSecret, {
    expiresIn: '7d'
  })

export const verifyAccessToken = (token: string) => {
  let payload: string | JwtPayload

  try {
    payload = jwt.verify(token, env.jwtSecret)
  } catch {
    throw new HttpError(401, 'Требуется авторизация')
  }

  if (
    typeof payload === 'string' ||
    typeof payload.id !== 'number' ||
    typeof payload.login !== 'string'
  ) {
    throw new HttpError(401, 'Некорректный токен')
  }

  return {
    id: payload.id,
    login: payload.login
  }
}

export const getCurrentUser = async (userId: number) => {
  const userRow = await findUserById(userId)

  if (!userRow) {
    throw new HttpError(401, 'Пользователь не найден')
  }

  return toAuthenticatedUser(userRow)
}
