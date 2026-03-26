# Cloud Deploy Postgres Supabase

Проект адаптирован под бесплатный деплой без локальной SQLite и без локальной папки `uploads/audio`.

- `backend/src/db/database.ts` переведен на PostgreSQL через `pg`, инициализация схемы вынесена в `backend/sql/init.sql`
- `backend/src/services/storageService.ts` добавляет загрузку и удаление аудио через Supabase Storage
- `backend/src/services/trackService.ts` теперь сохраняет в Postgres `file_url`, `file_path`, `mime_type`, `size`, а при удалении трека удаляет и файл из Supabase Storage
- `backend/src/routes/trackRoutes.ts` переведен на `multer.memoryStorage()` и оставляет текущие ограничения по доступу и форматам `mp3`, `wav`, `ogg`
- `backend/.env.example` и `frontend/.env.example` обновлены под облачные env-переменные, frontend переведен на `VITE_API_URL`
- `frontend/public/_redirects` добавлен для SPA rewrite на Netlify
- `README.md` полностью переписан под локальный запуск, Supabase, Render и Netlify
