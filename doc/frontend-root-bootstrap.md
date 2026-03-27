# Frontend Root Bootstrap

Исправлена ситуация, при которой после запуска фронтенда `div#root` оставался пустым.

- В `frontend/.env` добавлен локальный `VITE_API_URL=http://localhost:10000`, чтобы dev-сборка получала адрес backend
- В `frontend/src/main.tsx` запуск приложения переведён на безопасный bootstrap через динамический импорт `App`, чтобы ошибки инициализации можно было перехватывать до первого рендера
- В `frontend/src/shared/config/env.ts` текст ошибки для отсутствующего `VITE_API_URL` сделан явным: с подсказкой создать `frontend/.env` из `frontend/.env.example`
- В `frontend/src/app/styles/index.css` добавлены стили экрана bootstrap-ошибки, чтобы при проблеме конфигурации пользователь видел сообщение, а не пустую страницу
