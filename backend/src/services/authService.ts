import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from '../config/env.js'
import { getDatabase } from '../db/database.js'
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

const findUserByLogin = (login: string) => {
  const database = getDatabase()

  return database
    .prepare('SELECT id, login, password_hash FROM users WHERE login = ?')
    .get(login) as UserRow | undefined
}

const findUserById = (userId: number) => {
  const database = getDatabase()

  return database
    .prepare('SELECT id, login, password_hash FROM users WHERE id = ?')
    .get(userId) as UserRow | undefined
}

export const ensureAdminUser = async () => {
  const existingAdmin = findUserByLogin(env.adminLogin)

  if (existingAdmin) {
    return false
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 10)
  const database = getDatabase()

  database
    .prepare('INSERT INTO users (login, password_hash) VALUES (?, ?)')
    .run(env.adminLogin, passwordHash)

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

  const userRow = findUserByLogin(sanitizedLogin)

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

export const getCurrentUser = (userId: number) => {
  const userRow = findUserById(userId)

  if (!userRow) {
    throw new HttpError(401, 'Пользователь не найден')
  }

  return toAuthenticatedUser(userRow)
}
