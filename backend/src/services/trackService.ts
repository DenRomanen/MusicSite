import { query } from '../db/database.js'
import {
  getStorageFileUrl,
  removeStorageFile,
  uploadAudioFile
} from './storageService.js'
import { HttpError } from '../utils/httpError.js'

type TrackRow = {
  id: number
  title: string
  artist: string
  file_url: string
  file_path: string
  mime_type: string
  size: number
  uploaded_by: number
  created_at: string
}

type CreateTrackInput = {
  artist: string
  file: Express.Multer.File
  title: string
  uploadedBy: number
}

const mapTrackRowToResponse = async (
  trackRow: TrackRow,
  viewerId: number | undefined,
) => ({
  id: trackRow.id,
  title: trackRow.title,
  artist: trackRow.artist,
  audioUrl: await getStorageFileUrl(trackRow.file_path),
  createdAt: new Date(trackRow.created_at).toISOString(),
  canDelete: viewerId === trackRow.uploaded_by
})

export const listTracks = async (viewerId?: number) => {
  const result = await query<TrackRow>(
    `
      SELECT
        id,
        title,
        artist,
        file_url,
        file_path,
        mime_type,
        size,
        uploaded_by,
        created_at
      FROM tracks
      ORDER BY created_at DESC, id DESC
    `,
  )

  return Promise.all(
    result.rows.map((trackRow) => mapTrackRowToResponse(trackRow, viewerId)),
  )
}

export const createTrack = async ({
  artist,
  file,
  title,
  uploadedBy
}: CreateTrackInput) => {
  const uploadedAudio = await uploadAudioFile(file)
  let createdTrack: TrackRow | undefined

  try {
    const result = await query<TrackRow>(
      `
        INSERT INTO tracks (
          title,
          artist,
          file_url,
          file_path,
          mime_type,
          size,
          uploaded_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          title,
          artist,
          file_url,
          file_path,
          mime_type,
          size,
          uploaded_by,
          created_at
      `,
      [
        title,
        artist,
        uploadedAudio.fileUrl,
        uploadedAudio.filePath,
        file.mimetype,
        file.size,
        uploadedBy
      ],
    )

    createdTrack = result.rows[0]
  } catch (error) {
    await removeStorageFile(uploadedAudio.filePath)
    throw error
  }

  if (!createdTrack) {
    throw new HttpError(500, 'Не удалось сохранить трек')
  }

  return mapTrackRowToResponse(createdTrack, uploadedBy)
}

export const deleteTrack = async (trackId: number, authenticatedUserId: number) => {
  const result = await query<TrackRow>(
    `
      SELECT
        id,
        title,
        artist,
        file_url,
        file_path,
        mime_type,
        size,
        uploaded_by,
        created_at
      FROM tracks
      WHERE id = $1
      LIMIT 1
    `,
    [trackId],
  )
  const existingTrack = result.rows[0]

  if (!existingTrack) {
    throw new HttpError(404, 'Трек не найден')
  }

  if (existingTrack.uploaded_by !== authenticatedUserId) {
    throw new HttpError(403, 'Можно удалять только собственные треки')
  }

  await removeStorageFile(existingTrack.file_path)
  await query('DELETE FROM tracks WHERE id = $1', [trackId])
}
