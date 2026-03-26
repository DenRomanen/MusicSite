import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import multer from 'multer'
import { Router } from 'express'
import { env } from '../config/env.js'
import { attachOptionalUser, requireAuth } from '../middleware/auth.js'
import {
  createTrack,
  deleteTrack,
  listTracks,
  removeUploadedFile
} from '../services/trackService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getAudioFileValidationMessage,
  isAllowedAudioFile
} from '../utils/fileValidation.js'
import { HttpError } from '../utils/httpError.js'

fs.mkdirSync(env.uploadsPath, { recursive: true })

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
  storage: multer.diskStorage({
    destination: (_request, _file, callback) => {
      callback(null, env.uploadsPath)
    },
    filename: (_request, file, callback) => {
      callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
    }
  })
})

export const trackRouter = Router()

trackRouter.get(
  '/',
  attachOptionalUser,
  asyncHandler(async (request, response) => {
    response.json(listTracks(request, request.authenticatedUser?.id))
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

    if (!title?.trim() || !artist?.trim()) {
      await removeUploadedFile(request.file.filename)
      throw new HttpError(400, 'Название и исполнитель обязательны')
    }

    try {
      const createdTrack = createTrack({
        artist: artist.trim(),
        file: request.file,
        request,
        title: title.trim(),
        uploadedBy: request.authenticatedUser!.id
      })

      response.status(201).json(createdTrack)
    } catch (error) {
      await removeUploadedFile(request.file.filename)
      throw error
    }
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
