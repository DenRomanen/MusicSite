import { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { UploadTrackForm } from '@/features/tracks/ui/UploadTrackForm'
import { Track, UploadTrackPayload } from '@/entities/track/model/types'
import { TrackListRow } from '@/entities/track/ui/TrackListRow'
import {
  deleteTrackRequest,
  getTracksRequest,
  uploadTrackRequest,
} from '@/shared/api/tracks'
import { getApiErrorMessage } from '@/shared/api/client'
import { useAppSelector } from '@/shared/hooks/redux'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'

type TrackSortOrder = 'asc' | 'desc'
type PaginationItem = number | 'ellipsis'

const ITEMS_PER_PAGE = 20

const trackTitleCollator = new Intl.Collator(['ru', 'en'], {
  sensitivity: 'base',
})

const getPaginationItems = (
  totalPages: number,
  currentPage: number,
): PaginationItem[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pageNumbers = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ])
  const sortedPageNumbers = [...pageNumbers]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((firstPage, secondPage) => firstPage - secondPage)

  return sortedPageNumbers.reduce<PaginationItem[]>(
    (items, pageNumber, index) => {
      const previousPage = sortedPageNumbers[index - 1]

      if (previousPage && pageNumber - previousPage > 1) {
        items.push('ellipsis')
      }

      items.push(pageNumber)

      return items
    },
    [],
  )
}

export const TrackLibrary = () => {
  const { isBootstrapping, token, user } = useAppSelector((state) => state.auth)
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [deletingTrackId, setDeletingTrackId] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [sortOrder, setSortOrder] = useState<TrackSortOrder>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        const loadedTracks = await getTracksRequest(token)
        setTracks(loadedTracks)
      } catch (error) {
        setLoadError(getApiErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    void loadTracks()
  }, [token])

  const handleUploadTrack = async (payload: UploadTrackPayload) => {
    if (!token) {
      throw new Error('Нужна авторизация для загрузки трека')
    }

    const loadingToastId = toast.loading('Загружаем трек на сервер')

    try {
      const createdTrack = await uploadTrackRequest({
        ...payload,
        token,
      })

      setTracks((currentTracks) => [createdTrack, ...currentTracks])
      toast.success('Трек добавлен', { id: loadingToastId })
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      toast.error(errorMessage, { id: loadingToastId })
      throw new Error(errorMessage)
    }
  }

  const handleDeleteTrack = async (trackId: number) => {
    if (!token) {
      return
    }

    setDeletingTrackId(trackId)
    const loadingToastId = toast.loading('Удаляем трек')

    try {
      await deleteTrackRequest(trackId, token)
      setTracks((currentTracks) =>
        currentTracks.filter((track) => track.id !== trackId),
      )
      toast.success('Трек удален', { id: loadingToastId })
    } catch (error) {
      toast.error(getApiErrorMessage(error), { id: loadingToastId })
    } finally {
      setDeletingTrackId(null)
    }
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as TrackSortOrder)
    setCurrentPage(1)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const normalizedSearchValue = searchValue.trim().toLocaleLowerCase()
  const filteredTracks = tracks.filter((track) => {
    if (!normalizedSearchValue) {
      return true
    }

    return track.title.toLocaleLowerCase().includes(normalizedSearchValue)
  })
  const sortedTracks = [...filteredTracks].sort((firstTrack, secondTrack) => {
    const comparison = trackTitleCollator.compare(
      firstTrack.title,
      secondTrack.title,
    )

    if (sortOrder === 'asc') {
      return comparison
    }

    return -comparison
  })
  const totalPages = Math.ceil(sortedTracks.length / ITEMS_PER_PAGE)
  const resolvedCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages)
  const paginatedTracks = sortedTracks.slice(
    (resolvedCurrentPage - 1) * ITEMS_PER_PAGE,
    resolvedCurrentPage * ITEMS_PER_PAGE,
  )
  const paginationItems = getPaginationItems(totalPages, resolvedCurrentPage)
  const hasDeleteColumn = Boolean(user)
  const trackCountLabel =
    sortedTracks.length === tracks.length
      ? `${tracks.length} записей`
      : `${sortedTracks.length} из ${tracks.length} записей`

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1)
      return
    }

    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  return (
    <section className="page-stack page-stack--fill track-library">
      {user && !isBootstrapping ? (
        <UploadTrackForm onSubmitTrack={handleUploadTrack} />
      ) : null}

      <Card className="section-card section-card--fill track-library__card">
        <div className="section-heading section-heading--compact">
          <div>
            <div className="eyebrow">Треки</div>
          </div>
          <span className="section-meta">{trackCountLabel}</span>
        </div>

        {isLoading ? <p className="status-copy">Загрузка треков...</p> : null}
        {loadError ? (
          <p className="status-copy error-copy">{loadError}</p>
        ) : null}
        {!isLoading && !loadError && tracks.length === 0 ? (
          <p className="status-copy">
            Каталог пока пуст. После входа можно загрузить первый аудиофайл.
          </p>
        ) : null}

        {!isLoading && !loadError && tracks.length > 0 ? (
          <>
            <div className="track-toolbar">
              <label className="track-toolbar__field">
                <span className="track-toolbar__caption">Поиск</span>
                <input
                  aria-label="Поиск по названию песни"
                  className="input track-toolbar__input"
                  onChange={handleSearchChange}
                  placeholder="Название песни"
                  type="search"
                  value={searchValue}
                />
              </label>

              <label className="track-toolbar__field track-toolbar__field--sort">
                <span className="track-toolbar__caption">Сортировка</span>
                <select
                  aria-label="Сортировка списка песен"
                  className="input track-toolbar__input track-toolbar__select"
                  onChange={handleSortChange}
                  value={sortOrder}
                >
                  <option value="asc">А-Я / A-Z</option>
                  <option value="desc">Я-А / Z-A</option>
                </select>
              </label>
            </div>

            {sortedTracks.length === 0 ? (
              <p className="status-copy">
                По вашему запросу ничего не найдено.
              </p>
            ) : (
              <div
                className={`track-list${hasDeleteColumn ? ' track-list--with-actions' : ''}`}
              >
                <div className="track-list__header" aria-hidden="true">
                  <span className="track-list__column">Название песни</span>
                  <span className="track-list__column">Исполнитель</span>
                  <span className="track-list__column">Дата</span>
                  <span className="track-list__column">Плеер</span>
                  {hasDeleteColumn ? (
                    <span className="track-list__column track-list__column--actions">
                      Удаление
                    </span>
                  ) : null}
                </div>

                <div className="track-list__body" role="list">
                  {paginatedTracks.map((track) => (
                    <TrackListRow
                      hasDeleteColumn={hasDeleteColumn}
                      isDeleting={deletingTrackId === track.id}
                      key={track.id}
                      onDeleteTrack={
                        track.canDelete ? handleDeleteTrack : undefined
                      }
                      track={track}
                    />
                  ))}
                </div>
              </div>
            )}

            {totalPages > 1 ? (
              <nav
                aria-label="Навигация по страницам списка песен"
                className="pagination"
              >
                <Button
                  aria-label="Предыдущая страница"
                  className="pagination__button"
                  disabled={resolvedCurrentPage === 1}
                  onClick={() => handlePageChange(resolvedCurrentPage - 1)}
                  type="button"
                  variant="secondary"
                >
                  Назад
                </Button>

                <div className="pagination__pages">
                  {paginationItems.map((item, index) =>
                    item === 'ellipsis' ? (
                      <span
                        aria-hidden="true"
                        className="pagination__ellipsis"
                        key={`ellipsis-${index}`}
                      >
                        …
                      </span>
                    ) : (
                      <Button
                        aria-current={
                          item === resolvedCurrentPage ? 'page' : undefined
                        }
                        aria-label={`Страница ${item}`}
                        className={`pagination__button pagination__button--page${
                          item === resolvedCurrentPage
                            ? ' pagination__button--active'
                            : ''
                        }`}
                        key={item}
                        onClick={() => handlePageChange(item)}
                        type="button"
                        variant="secondary"
                      >
                        {item}
                      </Button>
                    ),
                  )}
                </div>

                <Button
                  aria-label="Следующая страница"
                  className="pagination__button"
                  disabled={resolvedCurrentPage === totalPages}
                  onClick={() => handlePageChange(resolvedCurrentPage + 1)}
                  type="button"
                  variant="secondary"
                >
                  Вперёд
                </Button>
              </nav>
            ) : null}
          </>
        ) : null}
      </Card>
    </section>
  )
}
