export const formatTrackDate = (dateValue: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateValue))
