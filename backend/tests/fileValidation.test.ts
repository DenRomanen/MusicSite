import { describe, expect, it } from 'vitest'
import {
  getAudioFileValidationMessage,
  isAllowedAudioFile
} from '../src/utils/fileValidation.js'

describe('fileValidation', () => {
  it('accepts supported audio formats', () => {
    expect(
      isAllowedAudioFile({
        mimetype: 'audio/mpeg',
        originalname: 'track.mp3'
      }),
    ).toBe(true)
  })

  it('rejects unsupported audio formats', () => {
    expect(
      isAllowedAudioFile({
        mimetype: 'text/plain',
        originalname: 'track.txt'
      }),
    ).toBe(false)
    expect(getAudioFileValidationMessage()).toBe('Допустимы только mp3, wav и ogg')
  })
})
