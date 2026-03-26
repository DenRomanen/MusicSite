import { describe, expect, it } from 'vitest'
import { formatTrackDate } from '@/shared/lib/formatTrackDate'

describe('formatTrackDate', () => {
  it('formats an ISO date for ru locale', () => {
    expect(formatTrackDate('2026-03-26T12:00:00.000Z')).toContain('2026')
  })
})
