import path from 'node:path'
import dotenv from 'dotenv'

const currentWorkingDirectory = process.cwd()
const repositoryRoot =
  path.basename(currentWorkingDirectory) === 'backend'
    ? path.resolve(currentWorkingDirectory, '..')
    : currentWorkingDirectory
const backendRoot = path.join(repositoryRoot, 'backend')

const loadEnvironmentFile = (filePath: string) => {
  dotenv.config({
    path: filePath,
    override: false,
    quiet: true
  })
}

loadEnvironmentFile(path.join(repositoryRoot, '.env'))
loadEnvironmentFile(path.join(repositoryRoot, '.env.local'))
loadEnvironmentFile(path.join(backendRoot, '.env'))
loadEnvironmentFile(path.join(backendRoot, '.env.local'))

const resolveFrontendUrls = () => {
  const rawFrontendUrl = process.env.FRONTEND_URL?.trim()

  if (!rawFrontendUrl) {
    return ['http://localhost:5173']
  }

  return rawFrontendUrl
    .split(',')
    .map((frontendUrl) => frontendUrl.trim())
    .filter(Boolean)
}

export const env = {
  backendRoot,
  databaseUrl: process.env.DATABASE_URL?.trim() ?? '',
  frontendUrls: resolveFrontendUrls(),
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  port: Number(process.env.PORT || 10000),
  repositoryRoot,
  supabaseBucket: process.env.SUPABASE_BUCKET?.trim() || 'audio',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '',
  supabaseUrl: process.env.SUPABASE_URL?.trim() ?? ''
}

export const getMissingRuntimeEnv = () => {
  const requiredEnvironmentVariables = [
    ['DATABASE_URL', env.databaseUrl],
    ['SUPABASE_URL', env.supabaseUrl],
    ['SUPABASE_SERVICE_ROLE_KEY', env.supabaseServiceRoleKey]
  ] as const

  return requiredEnvironmentVariables
    .filter(([, value]) => !value)
    .map(([environmentVariableName]) => environmentVariableName)
}

export const assertRequiredRuntimeEnv = (context: string) => {
  const missingRuntimeEnv = getMissingRuntimeEnv()

  if (missingRuntimeEnv.length === 0) {
    return
  }

  throw new Error(
    `Missing required environment variables for ${context}: ${missingRuntimeEnv.join(', ')}. Copy backend/.env.example to backend/.env and fill in the values.`,
  )
}
