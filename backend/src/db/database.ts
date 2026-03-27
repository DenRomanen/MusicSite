import fs from 'node:fs/promises'
import path from 'node:path'
import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg'
import { env } from '../config/env.js'

let databasePool: Pool | null = null
let initializationPromise: Promise<Pool> | null = null

const normalizeDatabaseUrl = (databaseUrl: string) => {
  if (!databaseUrl.includes('supabase.com')) {
    return databaseUrl
  }

  const parsedDatabaseUrl = new URL(databaseUrl)

  parsedDatabaseUrl.searchParams.delete('sslmode')
  parsedDatabaseUrl.searchParams.delete('uselibpqcompat')

  return parsedDatabaseUrl.toString()
}

const getDatabasePoolConfig = (): PoolConfig => {
  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is required to connect to PostgreSQL')
  }

  const poolConfig: PoolConfig = {
    connectionString: normalizeDatabaseUrl(env.databaseUrl)
  }

  if (env.databaseUrl.includes('supabase.com')) {
    poolConfig.ssl = {
      rejectUnauthorized: false
    }
  }

  return poolConfig
}

const getDatabasePool = () => {
  if (databasePool) {
    return databasePool
  }

  databasePool = new Pool(getDatabasePoolConfig())

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
