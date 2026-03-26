import { ErrorRequestHandler, Request, Response } from 'express'
import multer from 'multer'
import { HttpError } from '../utils/httpError.js'

export const notFoundHandler = (_request: Request, response: Response) => {
  response.status(404).json({
    message: 'Маршрут не найден'
  })
}

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  void _next

  if (error instanceof multer.MulterError) {
    response.status(400).json({
      message:
        error.code === 'LIMIT_FILE_SIZE'
          ? 'Файл слишком большой'
          : 'Ошибка обработки загружаемого файла'
    })
    return
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message
    })
    return
  }

  console.error(error)

  response.status(500).json({
    message: 'Внутренняя ошибка сервера'
  })
}
