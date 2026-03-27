import { describe, expect, it } from 'vitest'
import {
  createAccessToken,
  verifyAccessToken
} from '../src/services/authService.js'

describe('authService', () => {
  it('creates and verifies access tokens', () => {
    const token = createAccessToken({
      id: 7,
      login: 'admin-login'
    })

    expect(verifyAccessToken(token)).toEqual({
      id: 7,
      login: 'admin-login'
    })
  })
})
