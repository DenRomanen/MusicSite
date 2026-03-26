import fs from 'node:fs/promises'
import path from 'node:path'
import { Pool, QueryResult, QueryResultRow } from 'pg'
import { env } from '../config/env.js'

let databasePool: Pool | null = null
let initializationPromise: Promise<Pool> | null = null

const getDatabasePool = () => {
  if (databasePool) {
    return databasePool
  }

  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is required to connect to PostgreSQL')
  }

  databasePool = new Pool({
    connectionString: env.databaseUrl
  })

  return databasePool
}

export const query = async <Row extends QueryResultRow>(
  text: string,
  values?: unknown[],
): Promise<QueryResult<Row>> => getDatabasePool().query<Row>(text, values)

export const initializeDatabase = async () => {
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    const schemaFilePath = path.join(env.backendRoot, 'sql', 'init.sql')
    const schemaSql = await fs.readFile(schemaFilePath, 'utf-8')
    const pool = getDatabasePool()

    await pool.query(schemaSql)

    return pool
  })()

  return initializationPromise
}
