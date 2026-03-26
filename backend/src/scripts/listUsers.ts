import { getDatabase } from '../db/database.js'

type UserSummaryRow = {
  id: number
  login: string
  created_at: string
}

const listUsers = () => {
  const database = getDatabase()
  const userRows = database
    .prepare('SELECT id, login, created_at FROM users ORDER BY id')
    .all() as UserSummaryRow[]

  if (userRows.length === 0) {
    console.log('No users found in the database')
    return
  }

  console.table(userRows)
}

listUsers()
