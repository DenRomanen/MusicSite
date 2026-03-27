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
  apiBaseUrl: string
  artist: string
  file: Express.Multer.File
  title: string
  uploadedBy: number
}

type TrackStreamSource = {
  mimeType: string
  signedUrl: string
}

const buildTrackAudioUrl = (trackId: number, apiBaseUrl: string) =>
  `${apiBaseUrl}/tracks/${trackId}/stream`

const mapTrackRowToResponse = (
  trackRow: TrackRow,
  viewerId: number | undefined,
  apiBaseUrl: string,
) => ({
  id: trackRow.id,
  title: trackRow.title,
  artist: trackRow.artist,
  audioUrl: buildTrackAudioUrl(trackRow.id, apiBaseUrl),
  createdAt: new Date(trackRow.created_at).toISOString(),
  canDelete: viewerId === trackRow.uploaded_by
})

const getTrackById = async (trackId: number) => {
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

  return result.rows[0]
}

export const listTracks = async (viewerId: number | undefined, apiBaseUrl: string) => {
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

  return result.rows.map((trackRow) =>
    mapTrackRowToResponse(trackRow, viewerId, apiBaseUrl),
  )
}

export const createTrack = async ({
  apiBaseUrl,
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

  return mapTrackRowToResponse(createdTrack, uploadedBy, apiBaseUrl)
}

export const getTrackStreamSource = async (
  trackId: number,
): Promise<TrackStreamSource> => {
  const existingTrack = await getTrackById(trackId)

  if (!existingTrack) {
    throw new HttpError(404, 'Трек не найден')
  }

  return {
    mimeType: existingTrack.mime_type,
    signedUrl: await getStorageFileUrl(existingTrack.file_path)
  }
}

export const deleteTrack = async (trackId: number, authenticatedUserId: number) => {
  const existingTrack = await getTrackById(trackId)

  if (!existingTrack) {
    throw new HttpError(404, 'Трек не найден')
  }

  if (existingTrack.uploaded_by !== authenticatedUserId) {
    throw new HttpError(403, 'Можно удалять только собственные треки')
  }

  await removeStorageFile(existingTrack.file_path)
  await query('DELETE FROM tracks WHERE id = $1', [trackId])
}
