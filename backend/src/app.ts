import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/authRoutes.js'
import { trackRouter } from './routes/trackRoutes.js'

export const app = express()

const healthcheckResponse = {
  endpoints: {
    auth: '/api/auth',
    health: '/health',
    tracks: '/api/tracks'
  },
  message: 'Music Room backend is running',
  status: 'ok'
} as const

const isAllowedOrigin = (origin: string | undefined) => {
  if (!origin) {
    return true
  }

  return env.frontendUrls.includes(origin)
}

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin))
    }
  }),
)
app.use(express.json())

app.get('/', (_request, response) => {
  response.json(healthcheckResponse)
})

app.get('/health', (_request, response) => {
  response.json({
    status: healthcheckResponse.status
  })
})

app.use('/api/auth', authRouter)
app.use('/api/tracks', trackRouter)

app.use(notFoundHandler)
app.use(errorHandler)
