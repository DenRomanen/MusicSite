import path from 'node:path'

export type AudioFileDescriptor = {
  mimetype: string
  originalname: string
}

export const allowedAudioExtensions = ['.mp3', '.wav', '.ogg']
export const allowedAudioMimeTypes = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg'
]

export const getAudioFileValidationMessage = () =>
  'Допустимы только mp3, wav и ogg'

export const isAllowedAudioFile = ({
  mimetype,
  originalname
}: AudioFileDescriptor) => {
  const fileExtension = path.extname(originalname).toLowerCase()

  return (
    allowedAudioExtensions.includes(fileExtension) &&
    allowedAudioMimeTypes.includes(mimetype)
  )
}
