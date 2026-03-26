import { AuthenticatedUser } from '../services/authService.js'

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser
    }
  }
}

export {}
