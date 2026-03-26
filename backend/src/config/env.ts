import path from 'node:path'
import dotenv from 'dotenv'

const currentWorkingDirectory = process.cwd()
const repositoryRoot =
  path.basename(currentWorkingDirectory) === 'backend'
    ? path.resolve(currentWorkingDirectory, '..')
    : currentWorkingDirectory
const backendRoot = path.join(repositoryRoot, 'backend')

dotenv.config({
  path: path.join(backendRoot, '.env')
})

const resolvePathFromRepositoryRoot = (value: string, fallbackValue: string) => {
  const resolvedValue = value || fallbackValue

  if (path.isAbsolute(resolvedValue)) {
    return resolvedValue
  }

  return path.resolve(repositoryRoot, resolvedValue)
}

export const env = {
  backendRoot,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databasePath: resolvePathFromRepositoryRoot(
    process.env.DATABASE_PATH || '',
    'backend/data/music.db',
  ),
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  port: Number(process.env.PORT || 4000),
  repositoryRoot,
  uploadsPath: resolvePathFromRepositoryRoot(
    process.env.UPLOADS_PATH || '',
    'uploads/audio',
  ),
  adminLogin: process.env.ADMIN_LOGIN || 'musicadmin',
  adminPassword: process.env.ADMIN_PASSWORD || 'MusicAdmin2026!'
}
