import { apiBaseUrl } from '@/shared/config/env'

export class ApiError extends Error {
  public readonly status: number

  public constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type RequestOptions = RequestInit & {
  token?: string
}

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Произошла неизвестная ошибка'
}

export const apiRequest = async <ResponseType>(
  path: string,
  options: RequestOptions = {},
) => {
  const { headers, token, ...restOptions } = options
  const requestHeaders = new Headers(headers)

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...restOptions,
    headers: requestHeaders
  })

  const responseContentType = response.headers.get('content-type')
  const hasJsonBody = responseContentType?.includes('application/json')
  const responseBody = hasJsonBody ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(
      responseBody?.message ?? 'Запрос завершился ошибкой',
      response.status,
    )
  }

  return responseBody as ResponseType
}
