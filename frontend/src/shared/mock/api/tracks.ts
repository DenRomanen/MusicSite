import { Track, UploadTrackPayload } from '@/entities/track/model/types'

type UploadMockTrackPayload = UploadTrackPayload & {
  token: string
}

type MockTrackRecord = Track & {
  objectUrl?: string
}

const mockAudioPreviewUrl =
  'data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSADAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA=='

const baseMockTracks: MockTrackRecord[] = [
  {
    id: 1,
    title: 'Midnight Over Arbat',
    artist: 'Neon Avenue',
    audioUrl: mockAudioPreviewUrl,
    createdAt: '2026-03-28T09:00:00.000Z',
    canDelete: false
  },
  {
    id: 2,
    title: 'Clouds Above The Station',
    artist: 'Northbound',
    audioUrl: mockAudioPreviewUrl,
    createdAt: '2026-03-27T14:20:00.000Z',
    canDelete: false
  },
  {
    id: 3,
    title: 'A Very Long Song Title For Development Layout Checks',
    artist: 'Signal Harbor',
    audioUrl: mockAudioPreviewUrl,
    createdAt: '2026-03-26T19:45:00.000Z',
    canDelete: false
  },
  {
    id: 4,
    title: 'Snowlight Echo',
    artist: 'Glass District',
    audioUrl: mockAudioPreviewUrl,
    createdAt: '2026-03-25T07:30:00.000Z',
    canDelete: false
  },
  {
    id: 5,
    title: 'Late Tram To The Riverside',
    artist: 'Velvet Signals',
    audioUrl: mockAudioPreviewUrl,
    createdAt: '2026-03-24T11:10:00.000Z',
    canDelete: false
  },
  {
    id: 6,
    title: 'Static Hearts',
    artist: 'Mono Summer',
    audioUrl: mockAudioPreviewUrl,
    createdAt: '2026-03-23T16:55:00.000Z',
    canDelete: false
  }
]

let mockTracksState = [...baseMockTracks]
let nextMockTrackId = baseMockTracks.length + 1

const mapMockTrack = (
  track: MockTrackRecord,
  canDelete: boolean,
): Track => ({
  id: track.id,
  title: track.title,
  artist: track.artist,
  audioUrl: track.audioUrl,
  createdAt: track.createdAt,
  canDelete
})

export const getMockTracksRequest = async (
  token?: string | null,
): Promise<Track[]> =>
  mockTracksState.map((track) => mapMockTrack(track, Boolean(token)))

export const uploadMockTrackRequest = async ({
  artist,
  audioFile,
  title,
  token
}: UploadMockTrackPayload): Promise<Track> => {
  const objectUrl = URL.createObjectURL(audioFile)
  const createdTrack: MockTrackRecord = {
    id: nextMockTrackId,
    title,
    artist,
    audioUrl: objectUrl,
    createdAt: new Date().toISOString(),
    canDelete: true,
    objectUrl
  }

  nextMockTrackId += 1
  mockTracksState = [createdTrack, ...mockTracksState]

  return mapMockTrack(createdTrack, Boolean(token))
}

export const deleteMockTrackRequest = async (trackId: number) => {
  const trackToDelete = mockTracksState.find((track) => track.id === trackId)

  if (trackToDelete?.objectUrl) {
    URL.revokeObjectURL(trackToDelete.objectUrl)
  }

  mockTracksState = mockTracksState.filter((track) => track.id !== trackId)

  return { success: true as const }
}
