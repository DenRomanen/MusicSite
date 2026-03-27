import { assertRequiredRuntimeEnv } from '../config/env.js'
import { initializeDatabase, query } from '../db/database.js'

type UserSummaryRow = {
  id: number
  login: string
  created_at: string
}

const listUsers = async () => {
  assertRequiredRuntimeEnv('users:list script')
  await initializeDatabase()
  const result = await query<UserSummaryRow>(
    'SELECT id, login, created_at FROM users ORDER BY id',
  )
  const userRows = result.rows

  if (userRows.length === 0) {
    console.log('No users found in the database')
    return
  }

  console.table(userRows)
}

void listUsers().catch((error) => {
  console.error(error)
  process.exit(1)
})
