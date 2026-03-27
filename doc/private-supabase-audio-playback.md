# Private Supabase Audio Playback

Исправлено воспроизведение треков для приватного bucket в Supabase Storage.

- В `backend/src/services/storageService.ts` добавлено получение signed URL для аудиофайлов через `createSignedUrl`
- В `backend/src/services/trackService.ts` ответ API `/api/tracks` и результат загрузки трека теперь возвращают signed URL, собранный из `file_path`, а не сохраненный public URL
- Это убирает зависимость воспроизведения от public bucket: треки открываются даже если bucket `audio` создан как private
