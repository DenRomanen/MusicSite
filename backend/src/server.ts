import fs from 'node:fs'
import { app } from './app.js'
import { env } from './config/env.js'
import { initializeDatabase } from './db/database.js'
import { ensureAdminUser } from './services/authService.js'

const startServer = async () => {
  fs.mkdirSync(env.uploadsPath, { recursive: true })
  initializeDatabase()
  await ensureAdminUser()

  app.listen(env.port, () => {
    console.log(`Backend server listening on http://localhost:${env.port}`)
  })
}

void startServer()
