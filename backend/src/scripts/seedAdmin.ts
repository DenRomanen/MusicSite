import { assertRequiredRuntimeEnv, env } from '../config/env.js'
import { initializeDatabase } from '../db/database.js'
import { ensureAdminUser } from '../services/authService.js'

const seedAdminUser = async () => {
  assertRequiredRuntimeEnv('seed script')
  await initializeDatabase()
  const wasCreated = await ensureAdminUser()

  console.log(
    wasCreated
      ? `Администратор создан с login: ${env.adminLogin}. Пароль взят из ADMIN_PASSWORD`
      : 'Администратор уже существует',
  )
}

void seedAdminUser().catch((error) => {
  console.error(error)
  process.exit(1)
})
