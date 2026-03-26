import { app } from './app.js'
import { env, getMissingRuntimeEnv } from './config/env.js'
import { initializeDatabase } from './db/database.js'
import { ensureAdminUser } from './services/authService.js'

const startServer = async () => {
  const missingRuntimeEnv = getMissingRuntimeEnv()

  if (missingRuntimeEnv.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingRuntimeEnv.join(', ')}. Copy backend/.env.example to backend/.env and fill in the values.`,
    )
  }

  await initializeDatabase()
  await ensureAdminUser()

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`Backend server listening on port ${env.port}`)
  })
}

void startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
