import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { env } from '../config/env.js'

let databaseInstance: DatabaseSync | null = null

const databaseSchema = `
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    filename TEXT NOT NULL UNIQUE,
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    uploaded_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_tracks_uploaded_by ON tracks (uploaded_by);
  CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON tracks (created_at DESC);
`

export const initializeDatabase = () => {
  if (databaseInstance) {
    return databaseInstance
  }

  fs.mkdirSync(path.dirname(env.databasePath), { recursive: true })

  databaseInstance = new DatabaseSync(env.databasePath)
  databaseInstance.exec(databaseSchema)

  return databaseInstance
}

export const getDatabase = () => initializeDatabase()
