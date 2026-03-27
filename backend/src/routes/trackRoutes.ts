import { Readable } from 'node:stream'
import { ReadableStream as NodeReadableStream } from 'node:stream/web'
import multer from 'multer'
import { Request, Response, Router } from 'express'
import { attachOptionalUser, requireAuth } from '../middleware/auth.js'
import {
  createTrack,
  deleteTrack,
  getTrackStreamSource,
  listTracks
} from '../services/trackService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getAudioFileValidationMessage,
  isAllowedAudioFile
} from '../utils/fileValidation.js'
import { HttpError } from '../utils/httpError.js'

const TRACK_TEXT_FIELD_MAX_LENGTH = 80
const STREAM_HEADER_NAMES = [
  'accept-ranges',
  'cache-control',
  'content-length',
  'content-range',
  'content-type',
  'etag',
  'last-modified'
] as const

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

const getApiBaseUrl = (request: Request) => {
  const forwardedProtocol = request
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim()
  const protocol = forwardedProtocol || request.protocol
  const host = request.get('x-forwarded-host') || request.get('host')

  if (!host) {
    throw new HttpError(500, 'Не удалось определить адрес backend')
  }

  return `${protocol}://${host}/api`
}

const forwardStreamHeaders = (
  response: Response,
  headers: Headers,
  fallbackMimeType: string,
) => {
  for (const headerName of STREAM_HEADER_NAMES) {
    const headerValue = headers.get(headerName)

    if (!headerValue) {
      continue
    }

    response.setHeader(headerName, headerValue)
  }

  if (!response.getHeader('content-type')) {
    response.setHeader('content-type', fallbackMimeType)
  }
}

export const trackRouter = Router()

trackRouter.get(
  '/',
  attachOptionalUser,
  asyncHandler(async (request, response) => {
    response.json(
      await listTracks(request.authenticatedUser?.id, getApiBaseUrl(request)),
    )
  }),
)

trackRouter.get(
  '/:id/stream',
  asyncHandler(async (request, response) => {
    const trackId = Number(request.params.id)

    if (!Number.isInteger(trackId) || trackId <= 0) {
      throw new HttpError(400, 'Некорректный идентификатор трека')
    }

    const { mimeType, signedUrl } = await getTrackStreamSource(trackId)
    const upstreamHeaders = new Headers()
    const rangeHeader = request.get('range')

    if (rangeHeader) {
      upstreamHeaders.set('range', rangeHeader)
    }

    const upstreamResponse = await fetch(signedUrl, {
      headers: upstreamHeaders
    })

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      if (upstreamResponse.status === 404) {
        throw new HttpError(404, 'Аудиофайл не найден')
      }

      throw new HttpError(
        502,
        'Не удалось получить аудиофайл из хранилища',
      )
    }

    forwardStreamHeaders(response, upstreamResponse.headers, mimeType)
    response.status(upstreamResponse.status)

    const audioStream = Readable.fromWeb(
      upstreamResponse.body as NodeReadableStream,
    )

    audioStream.pipe(response)
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
      apiBaseUrl: getApiBaseUrl(request),
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
