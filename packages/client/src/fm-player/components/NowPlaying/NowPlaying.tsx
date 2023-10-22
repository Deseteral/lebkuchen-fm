import * as React from 'react';
import { PlayerState } from 'lebkuchen-fm-service';
import { PlayIcon } from '../../icons/PlayIcon';
import { PauseIcon } from '../../icons/PauseIcon';
import { CloseIcon } from '../../icons/CloseIcon';

interface NowPlayingProps {
  playerState: PlayerState,
  onClose: () => void
}

function NowPlaying({ playerState, onClose }: NowPlayingProps) {
  if (!playerState.currentlyPlaying) {
    return null;
  }

  const currentSongTitle = playerState.currentlyPlaying.song?.name || '';
  const nextSongTitle = playerState.queue.length ? playerState?.queue[0].name : '';
  const { isPlaying } = playerState;

  return (
    <div className="absolute inset-x-5 bottom-14 flex flex-col p-8 bg-gray-900 opacity-75 rounded-lg outline-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-green-400">
            {isPlaying && (<PlayIcon />)}
            {!isPlaying && (<PauseIcon />)}
          </div>
          <div className="flex flex-col ml-3">
            <div className="font-medium text-xl leading-none text-gray-100"> {currentSongTitle}</div>
            {nextSongTitle.length > 0 && (
              <p className="text-gray-400 text-lg leading-none mt-2"><span className="font-bold italic">Next:</span> {nextSongTitle}</p>
            )}
          </div>
        </div>
      </div>
      <div
        className="absolute right-1 top-1"
        role="button"
        onClick={onClose}
        tabIndex={0}
        aria-hidden="true"
      >
        <CloseIcon />
      </div>
    </div>
  );
}

export { NowPlaying };
