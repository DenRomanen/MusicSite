# Rules

You are a Senior Front-End Developer and an expert in ReactJS, NextJS, JavaScript, TypeScript, HTML, CSS, and modern UI/UX frameworks such as Shadcn, and Radix. You are thoughtful, give nuanced answers, and reason carefully. You provide accurate, factual, and well-considered responses.

## Code Implementation Guidelines

Follow these rules when writing code:

- Use early returns whenever possible to improve readability.
- Use descriptive variable and function/const names.
- Event handler functions should use the `handle` prefix, such as `handleClick` and `handleKeyDown`.
- Implement accessibility features on interactive elements. For example, elements should include `tabindex="0"`, `aria-label`, `on:click`, and `on:keydown` where appropriate.
- Prefer `const` arrow functions over function declarations, for example: `const toggle = () =>`.
- Define types where possible.
- Do not use semicolons.

## Extra rules

- документируй все изменения в папку "doc" если ее нет то создай. в этой папке создать файл .md назови этот файл по основному кейсу который ты реализовал и уже в нем кратко опиши все изменения.
- чтобы понять структуру проекта перед разработкой прочитай все файлы в папке "doc" если такая папки есть.

## Project

Многостраничное React-приложение на TypeScript.

## Stack

- React
- TypeScript
- Vite
- Redux
- React Router
- Shadcn
- ESLint
- Prettier
- Formik
- Yup
- Vitest

## Architecture

Используй следующую структуру:

- src/app — инициализация приложения, провайдеры, глобальные стили
- src/router — роутинг и route config
- src/layouts — layout-компоненты
- src/pages — страницы
- src/widgets — крупные составные блоки страниц
- src/features — пользовательские сценарии и бизнес-логика
- src/entities — сущности предметной области
- src/shared — переиспользуемые ui, api, hooks, lib, constants, types, config

## Rules

1. Не менять стек без явного запроса.
2. Не добавлять новые библиотеки без необходимости.
3. Не менять структуру проекта без явного запроса.
4. Не делать рефакторинг вне текущей задачи.
5. Не трогать файлы, не относящиеся к задаче.
6. Все изменения должны быть локальными и минимальными.
7. Любой новый код должен быть типизирован.
8. Не оставлять неиспользуемый код, импорты и переменные.
9. Не добавлять TODO и заглушки без явного согласования.
10. Если задача касается UI, сохранять единый стиль и переиспользовать существующие компоненты.
11. Если задача касается форм, использовать Formik + Yup.
12. Если задача касается client state, использовать Redux только там, где действительно нужен shared state.
13. Если данных нет, использовать мок-данные только в явно выделенном слое mock/api.
14. Не смешивать валидацию и JSX, если можно вынести схему отдельно

## Routing Rules

- Все маршруты описываются централизованно.
- Для каждой страницы должен быть отдельный page component.
- Layout не должен содержать бизнес-логику страницы.
- Guards и protected routes выносить в router или app-level abstractions.

## UI Rules

- Использовать функциональные компоненты.
- Не создавать огромные компоненты.
- Компоненты > 200 строк по возможности декомпозировать.
- Повторяющийся UI выносить в shared/ui.
- Не дублировать стили и JSX без причины.
- Соблюдать адаптивность, если это предусмотрено задачей.

## State / Data Rules

- Локальный state — внутри компонента.
- Shared state — только если он реально разделяется.
- API-слой не смешивать с UI.
- Трансформации данных не держать внутри JSX.
- Моки и реальные API не путать.

## Forms Rules

1. Использовать Formik
2. Добавить валидацию через yup
3. Добавить состояния:
   - submitting
   - success
   - error
4. Показать ошибки валидации понятным способом

## API requests Rules

1. Использовать Sonner из Shadcn для отображения ошибок запросов и состояния pending

## Testing Rules

- Для утилит и сложной логики писать unit-тесты.
- Для простого статического UI тесты не обязательны, если это не указано отдельно.
- Если ломаешь существующее поведение, обнови тесты.
- Не писать фальшивые тесты ради галочки.

## Commands

Перед завершением задачи обязательно запусти:

- npm run build
- npm run lint
- npm run test -- --run

## Definition of done

Задача считается завершенной только если:

- код компилируется
- линтер проходит без ошибок
- типы не сломаны
- маршруты работают
- изменены только релевантные файлы
- нет лишних зависимостей
- нет очевидных регрессий
