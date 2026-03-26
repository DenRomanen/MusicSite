# Music Site Fullstack

Реализован полный fullstack-проект музыкального сайта с двумя приложениями:

- `frontend` на React + Vite + TypeScript с маршрутами `/`, `/login`, `*`, Redux-сессией, Formik/Yup-формами, Sonner-уведомлениями и адаптивным минималистичным интерфейсом
- `backend` на Express + TypeScript со встроенной SQLite-базой, JWT-авторизацией, seed-администратором, загрузкой аудио через multer и проверкой прав на удаление только собственных треков

Дополнительно добавлены:

- `.env.example`
- `README.md`
- root workspace scripts для `build`, `lint`, `test`
- базовые unit-тесты для схем валидации, форматирования даты, JWT и проверки допустимых аудиоформатов
