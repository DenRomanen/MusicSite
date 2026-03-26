import fs from 'node:fs/promises'
import path from 'node:path'
import { Request } from 'express'
import { env } from '../config/env.js'
import { getDatabase } from '../db/database.js'
import { HttpError } from '../utils/httpError.js'

type TrackRow = {
  id: number
  title: string
  artist: string
  filename: string
  original_filename: string
  mime_type: string
  size: number
  uploaded_by: number
  created_at: string
}

type CreateTrackInput = {
  artist: string
  file: Express.Multer.File
  request: Request
  title: string
  uploadedBy: number
}

const mapTrackRowToResponse = (
  trackRow: TrackRow,
  viewerId: number | undefined,
  request: Request,
) => {
  const requestHost = request.get('host')

  if (!requestHost) {
    throw new HttpError(500, 'Не удалось определить адрес сервера')
  }

  return {
    id: trackRow.id,
    title: trackRow.title,
    artist: trackRow.artist,
    audioUrl: new URL(
      `/uploads/${trackRow.filename}`,
      `${request.protocol}://${requestHost}`,
    ).toString(),
    createdAt: trackRow.created_at,
    canDelete: viewerId === trackRow.uploaded_by
  }
}

export const listTracks = (request: Request, viewerId?: number) => {
  const database = getDatabase()
  const trackRows = database
    .prepare(
      `
        SELECT
          id,
          title,
          artist,
          filename,
          original_filename,
          mime_type,
          size,
          uploaded_by,
          created_at
        FROM tracks
        ORDER BY datetime(created_at) DESC, id DESC
      `,
    )
    .all() as TrackRow[]

  return trackRows.map((trackRow) =>
    mapTrackRowToResponse(trackRow, viewerId, request),
  )
}

export const createTrack = ({
  artist,
  file,
  request,
  title,
  uploadedBy
}: CreateTrackInput) => {
  const database = getDatabase()
  const insertResult = database
    .prepare(
      `
        INSERT INTO tracks (
          title,
          artist,
          filename,
          original_filename,
          mime_type,
          size,
          uploaded_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      title,
      artist,
      file.filename,
      file.originalname,
      file.mimetype,
      file.size,
      uploadedBy,
    )

  const trackId = Number(insertResult.lastInsertRowid)
  const createdTrack = database
    .prepare(
      `
        SELECT
          id,
          title,
          artist,
          filename,
          original_filename,
          mime_type,
          size,
          uploaded_by,
          created_at
        FROM tracks
        WHERE id = ?
      `,
    )
    .get(trackId) as TrackRow | undefined

  if (!createdTrack) {
    throw new HttpError(500, 'Не удалось сохранить трек')
  }

  return mapTrackRowToResponse(createdTrack, uploadedBy, request)
}

export const removeUploadedFile = async (filename: string) => {
  try {
    await fs.unlink(path.join(env.uploadsPath, filename))
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !('code' in error) ||
      error.code !== 'ENOENT'
    ) {
      throw error
    }
  }
}

export const deleteTrack = async (trackId: number, authenticatedUserId: number) => {
  const database = getDatabase()
  const existingTrack = database
    .prepare(
      `
        SELECT
          id,
          title,
          artist,
          filename,
          original_filename,
          mime_type,
          size,
          uploaded_by,
          created_at
        FROM tracks
        WHERE id = ?
      `,
    )
    .get(trackId) as TrackRow | undefined

  if (!existingTrack) {
    throw new HttpError(404, 'Трек не найден')
  }

  if (existingTrack.uploaded_by !== authenticatedUserId) {
    throw new HttpError(403, 'Можно удалять только собственные треки')
  }

  database.prepare('DELETE FROM tracks WHERE id = ?').run(trackId)
  await removeUploadedFile(existingTrack.filename)
}
