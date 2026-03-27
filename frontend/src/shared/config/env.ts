const API_URL = import.meta.env.VITE_API_URL
const missingApiUrlMessage =
  'VITE_API_URL is required. Create frontend/.env from frontend/.env.example'

if (!API_URL?.trim()) {
  throw new Error(missingApiUrlMessage)
}

const normalizedApiUrl = API_URL.trim().replace(/\/+$/, '')

export const apiBaseUrl = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`
