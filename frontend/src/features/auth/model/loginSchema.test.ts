import { describe, expect, it } from 'vitest'
import { loginValidationSchema } from '@/features/auth/model/loginSchema'

describe('loginValidationSchema', () => {
  it('accepts filled credentials', async () => {
    const validationResult = await loginValidationSchema.isValid({
      login: 'admin-login',
      password: 'safe-password'
    })

    expect(validationResult).toBe(true)
  })

  it('rejects empty fields', async () => {
    const validationResult = await loginValidationSchema.isValid({
      login: '',
      password: ''
    })

    expect(validationResult).toBe(false)
  })
})
