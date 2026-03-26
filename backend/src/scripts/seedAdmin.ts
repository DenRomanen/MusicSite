import { initializeDatabase } from '../db/database.js'
import { ensureAdminUser } from '../services/authService.js'

const seedAdminUser = async () => {
  initializeDatabase()
  const wasCreated = await ensureAdminUser()

  console.log(
    wasCreated
      ? 'Администратор создан: musicadmin / MusicAdmin2026!'
      : 'Администратор уже существует',
  )
}

void seedAdminUser()
