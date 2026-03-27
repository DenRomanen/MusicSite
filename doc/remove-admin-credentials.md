# Remove Admin Credentials

Убраны точные упоминания seed-логина и seed-пароля администратора из репозитория.

- `backend/src/config/env.ts` теперь читает `ADMIN_LOGIN` и `ADMIN_PASSWORD` из env и считает их обязательными runtime-переменными
- `backend/.env.example` и `README.md` обновлены безопасными плейсхолдерами вместо конкретных значений
- `backend/src/scripts/seedAdmin.ts`, `idea.md`, `frontend/src/features/auth/ui/LoginForm.tsx` и тесты очищены от точных строк логина и пароля
