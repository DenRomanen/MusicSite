# Backend CORS Origin Normalization

Исправлена проверка CORS для frontend-доменов, заданных через env.

- В `backend/src/config/env.ts` добавлена нормализация значений `FRONTEND_URL`: backend удаляет завершающий `/` у каждого origin перед сравнением
- Это устраняет ошибку, когда в env указан адрес вида `http://example.com/`, а браузер присылает `Origin: http://example.com`
- В `README.md` добавлено уточнение, что `FRONTEND_URL` может содержать несколько origin через запятую и что завершающий `/` не влияет на CORS
