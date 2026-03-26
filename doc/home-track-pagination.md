# Home Track Pagination

Добавлена frontend-пагинация для списка песен на главной странице `/`.

- В `frontend/src/widgets/track-library/TrackLibrary.tsx` добавлены `currentPage`, `ITEMS_PER_PAGE = 20`, вычисления `filteredTracks`, `sortedTracks`, `paginatedTracks`, `totalPages` и автоматический сброс страницы при смене поиска и сортировки
- Пагинация применяется после фильтрации по названию и после сортировки по алфавиту, блок навигации показывается только если найдено больше 20 треков
- В `frontend/src/app/styles/index.css` добавлены компактные стили для кнопок `Назад`, номеров страниц, `Вперёд` и активного состояния текущей страницы
