const rawApiUrl = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:10000'
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '')

export const apiBaseUrl = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`
