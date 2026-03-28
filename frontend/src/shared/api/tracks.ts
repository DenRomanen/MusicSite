import { Track, UploadTrackPayload } from '@/entities/track/model/types'
import { apiRequest } from '@/shared/api/client'
import {
  deleteMockTrackRequest,
  getMockTracksRequest,
  uploadMockTrackRequest,
} from '@/shared/mock/api/tracks'

type UploadTrackRequest = UploadTrackPayload & {
  token: string
}

const shouldUseTrackMocks = import.meta.env.DEV

export const getTracksRequest = (token?: string | null) => {
  if (shouldUseTrackMocks) {
    return getMockTracksRequest(token)
  }

  return apiRequest<Track[]>('/tracks', {
    method: 'GET',
    token: token ?? undefined
  })
}

export const uploadTrackRequest = async ({
  artist,
  audioFile,
  title,
  token
}: UploadTrackRequest) => {
  if (shouldUseTrackMocks) {
    return uploadMockTrackRequest({
      artist,
      audioFile,
      title,
      token
    })
  }

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

export const deleteTrackRequest = (trackId: number, token: string) => {
  if (shouldUseTrackMocks) {
    return deleteMockTrackRequest(trackId)
  }

  return apiRequest<{ success: true }>(`/tracks/${trackId}`, {
    method: 'DELETE',
    token
  })
}
