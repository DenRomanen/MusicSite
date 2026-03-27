import { SyntheticEvent } from 'react'
import { Track } from '@/entities/track/model/types'
import { formatTrackDate } from '@/shared/lib/formatTrackDate'
import { Button } from '@/shared/ui/Button'

type TrackListRowProps = {
  hasDeleteColumn: boolean
  isDeleting: boolean
  onAudioEnded: (
    trackId: number,
    audioElement: HTMLAudioElement,
  ) => void
  onAudioPause: (
    trackId: number,
    audioElement: HTMLAudioElement,
  ) => void
  onAudioPlay: (
    trackId: number,
    audioElement: HTMLAudioElement,
  ) => void
  onDeleteTrack?: (trackId: number) => Promise<void>
  track: Track
}

export const TrackListRow = ({
  hasDeleteColumn,
  isDeleting,
  onAudioEnded,
  onAudioPause,
  onAudioPlay,
  onDeleteTrack,
  track
}: TrackListRowProps) => {
  const handleDeleteClick = () => {
    if (!onDeleteTrack) {
      return
    }

    void onDeleteTrack(track.id)
  }

  const handleAudioPlay = (event: SyntheticEvent<HTMLAudioElement>) => {
    onAudioPlay(track.id, event.currentTarget)
  }

  const handleAudioPause = (event: SyntheticEvent<HTMLAudioElement>) => {
    onAudioPause(track.id, event.currentTarget)
  }

  const handleAudioEnded = (event: SyntheticEvent<HTMLAudioElement>) => {
    onAudioEnded(track.id, event.currentTarget)
  }

  return (
    <div className="track-list__row" role="listitem">
      <div className="track-list__cell track-list__cell--title">
        <span className="track-list__mobile-label">
          {'\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435'}
        </span>
        <span className="track-list__title">{track.title}</span>
      </div>

      <div className="track-list__cell track-list__cell--artist">
        <span className="track-list__mobile-label">
          {'\u0418\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c'}
        </span>
        <span className="track-list__artist">{track.artist}</span>
      </div>

      <div className="track-list__cell track-list__cell--date">
        <span className="track-list__mobile-label">
          {'\u0414\u0430\u0442\u0430'}
        </span>
        <span className="track-list__date">{formatTrackDate(track.createdAt)}</span>
      </div>

      <div className="track-list__cell track-list__cell--player">
        <span className="track-list__mobile-label">
          {'\u041f\u043b\u0435\u0435\u0440'}
        </span>
        <audio
          aria-label={`Track player ${track.title}`}
          className="track-list__player"
          controls
          controlsList="nodownload"
          onEnded={handleAudioEnded}
          onPause={handleAudioPause}
          onPlay={handleAudioPlay}
          preload="none"
          src={track.audioUrl}
        >
          {
            '\u0412\u0430\u0448 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u043d\u0435 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u0432\u0441\u0442\u0440\u043e\u0435\u043d\u043d\u044b\u0439 \u0430\u0443\u0434\u0438\u043e\u043f\u043b\u0435\u0435\u0440.'
          }
        </audio>
      </div>

      {hasDeleteColumn ? (
        <div className="track-list__cell track-list__cell--actions">
          <span className="track-list__mobile-label">
            {'\u0423\u0434\u0430\u043b\u0435\u043d\u0438\u0435'}
          </span>
          {onDeleteTrack ? (
            <Button
              aria-label={`Delete track ${track.title}`}
              className="track-list__delete-button"
              disabled={isDeleting}
              onClick={handleDeleteClick}
              type="button"
              variant="danger"
            >
              {isDeleting
                ? '\u0423\u0434\u0430\u043b\u044f\u0435\u043c...'
                : '\u0423\u0434\u0430\u043b\u0438\u0442\u044c'}
            </Button>
          ) : (
            <span aria-hidden="true" className="track-list__action-placeholder" />
          )}
        </div>
      ) : null}
    </div>
  )
}
