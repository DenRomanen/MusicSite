import { Track, UploadTrackPayload } from '@/entities/track/model/types'
import { apiRequest } from '@/shared/api/client'

type UploadTrackRequest = UploadTrackPayload & {
  token: string
}

export const getTracksRequest = (token?: string | null) =>
  apiRequest<Track[]>('/tracks', {
    method: 'GET',
    token: token ?? undefined
  })

export const uploadTrackRequest = async ({
  artist,
  audioFile,
  title,
  token
}: UploadTrackRequest) => {
  const formData = new FormData()

  formData.append('title', title)
  formData.append('artist', artist)
  formData.append('audio', audioFile)

  return apiRequest<Track>('/tracks', {
    body: formData,
    method: 'POST',
    token
  })
}

export const deleteTrackRequest = (trackId: number, token: string) =>
  apiRequest<{ success: true }>(`/tracks/${trackId}`, {
    method: 'DELETE',
    token
  })
