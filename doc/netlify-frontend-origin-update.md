# Netlify Frontend Origin Update

Обновлен backend CORS origin после смены frontend-хостинга на Netlify.

- В `backend/.env` значение `FRONTEND_URL` расширено до списка origin: локальный `http://localhost:5173` сохранен для разработки, а новый production frontend добавлен как `https://musicsite78.netlify.app`
- Это позволяет backend принимать запросы и с локального Vite frontend, и с нового Netlify-домена без ручного переключения env между локальной разработкой и опубликованным сайтом
