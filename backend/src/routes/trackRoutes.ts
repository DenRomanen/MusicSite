import multer from 'multer'
import { Router } from 'express'
import { attachOptionalUser, requireAuth } from '../middleware/auth.js'
import { createTrack, deleteTrack, listTracks } from '../services/trackService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getAudioFileValidationMessage,
  isAllowedAudioFile
} from '../utils/fileValidation.js'
import { HttpError } from '../utils/httpError.js'

const TRACK_TEXT_FIELD_MAX_LENGTH = 80

const upload = multer({
  fileFilter: (_request, file, callback) => {
    if (!isAllowedAudioFile(file)) {
      callback(new HttpError(400, getAudioFileValidationMessage()))
      return
    }

    callback(null, true)
  },
  limits: {
    fileSize: 25 * 1024 * 1024
  },
  storage: multer.memoryStorage()
})

export const trackRouter = Router()

trackRouter.get(
  '/',
  attachOptionalUser,
  asyncHandler(async (request, response) => {
    response.json(await listTracks(request.authenticatedUser?.id))
  }),
)

trackRouter.post(
  '/',
  requireAuth,
  upload.single('audio'),
  asyncHandler(async (request, response) => {
    const { artist, title } = request.body as {
      artist?: string
      title?: string
    }

    if (!request.file) {
      throw new HttpError(400, 'Аудиофайл обязателен')
    }

    const normalizedTitle = typeof title === 'string' ? title.trim() : ''
    const normalizedArtist = typeof artist === 'string' ? artist.trim() : ''

    if (!normalizedTitle || !normalizedArtist) {
      throw new HttpError(400, 'Название и исполнитель обязательны')
    }

    if (
      normalizedTitle.length > TRACK_TEXT_FIELD_MAX_LENGTH ||
      normalizedArtist.length > TRACK_TEXT_FIELD_MAX_LENGTH
    ) {
      throw new HttpError(
        400,
        'Название и исполнитель должны быть не длиннее 80 символов',
      )
    }

    const createdTrack = await createTrack({
      artist: normalizedArtist,
      file: request.file,
      title: normalizedTitle,
      uploadedBy: request.authenticatedUser!.id
    })

    response.status(201).json(createdTrack)
  }),
)

trackRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (request, response) => {
    const trackId = Number(request.params.id)

    if (!Number.isInteger(trackId) || trackId <= 0) {
      throw new HttpError(400, 'Некорректный идентификатор трека')
    }

    await deleteTrack(trackId, request.authenticatedUser!.id)

    response.json({
      success: true
    })
  }),
)
