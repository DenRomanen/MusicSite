# Compact Track Library Layout

Доработан интерфейс списка песен на главной странице без изменений backend.

- `frontend/src/layouts/MainLayout.tsx` переведен на home-specific full-height layout с ограничением общего скролла страницы и передачей управления высотой в контент главной страницы
- `frontend/src/pages/home/HomePage.tsx` обновлен для компактного hero-блока и корректного размещения секции каталога в оставшейся высоте viewport
- `frontend/src/widgets/track-library/TrackLibrary.tsx` переведен в режим fill-height контейнера для таблицы песен
- `frontend/src/entities/track/ui/TrackListRow.tsx` убрано визуальное использование download через `controlsList="nodownload"` у встроенного плеера
- `frontend/src/app/styles/index.css` обновлены стили компактного tabular list, sticky header, отдельного scrollable body списка, full-height layout и адаптации для desktop, tablet и mobile
