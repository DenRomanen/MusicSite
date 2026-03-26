import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { env } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'

type UploadedAudioFile = {
  filePath: string
  fileUrl: string
}

let supabaseClient: SupabaseClient | null = null

const getSupabaseClient = () => {
  if (supabaseClient) {
    return supabaseClient
  }

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new HttpError(
      500,
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required',
    )
  }

  supabaseClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return supabaseClient
}

const buildAudioFilePath = (file: Express.Multer.File) => {
  const fileExtension = path.extname(file.originalname).toLowerCase()
  const dateSegment = new Date().toISOString().slice(0, 10)

  return `tracks/${dateSegment}/${randomUUID()}${fileExtension}`
}

export const uploadAudioFile = async (
  file: Express.Multer.File,
): Promise<UploadedAudioFile> => {
  const supabase = getSupabaseClient()
  const filePath = buildAudioFilePath(file)
  const { error: uploadError } = await supabase.storage
    .from(env.supabaseBucket)
    .upload(filePath, file.buffer, {
      cacheControl: '3600',
      contentType: file.mimetype,
      upsert: false
    })

  if (uploadError) {
    throw new HttpError(502, 'Не удалось загрузить аудиофайл в Supabase Storage')
  }

  const { data } = supabase.storage.from(env.supabaseBucket).getPublicUrl(filePath)

  if (!data.publicUrl) {
    await removeStorageFile(filePath)
    throw new HttpError(500, 'Не удалось получить публичную ссылку на аудиофайл')
  }

  return {
    filePath,
    fileUrl: data.publicUrl
  }
}

export const removeStorageFile = async (filePath: string) => {
  const supabase = getSupabaseClient()
  const { error } = await supabase.storage.from(env.supabaseBucket).remove([filePath])

  if (error) {
    throw new HttpError(502, 'Не удалось удалить аудиофайл из Supabase Storage')
  }
}
