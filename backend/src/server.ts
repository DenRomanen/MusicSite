import { app } from './app.js'
import { assertRequiredRuntimeEnv } from './config/env.js'
import { initializeDatabase } from './db/database.js'
import { ensureAdminUser } from './services/authService.js'

const startServer = async () => {
  const port = Number(process.env.PORT || 10000)
  assertRequiredRuntimeEnv('server startup')

  await initializeDatabase()
  await ensureAdminUser()

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on ${port}`)
  })
}

void startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
