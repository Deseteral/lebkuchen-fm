import * as React from 'react';
import { PlayIcon } from '../../icons/PlayIcon';

interface ShowNowPlayingButtonProps {
  onClick: () => void,
}

function ShowNowPlayingButton({ onClick }: ShowNowPlayingButtonProps) {
  return (
    <button
      type="button"
      className="outline-none p-2 bg-green-400 rounded-full hover:bg-green-600"
      onClick={onClick}
    >
      <PlayIcon />
    </button>
  );
}

export { ShowNowPlayingButton };
