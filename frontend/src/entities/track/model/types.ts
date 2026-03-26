export type Track = {
  id: number
  title: string
  artist: string
  audioUrl: string
  createdAt: string
  canDelete: boolean
}

export type UploadTrackPayload = {
  title: string
  artist: string
  audioFile: File
}
