import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/authRoutes.js'
import { trackRouter } from './routes/trackRoutes.js'

export const app = express()

app.use(
  cors({
    origin: env.corsOrigin
  }),
)
app.use(express.json())
app.use('/uploads', express.static(env.uploadsPath))

app.use('/api/auth', authRouter)
app.use('/api/tracks', trackRouter)

app.use(notFoundHandler)
app.use(errorHandler)
