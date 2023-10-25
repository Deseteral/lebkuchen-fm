import * as React from 'react';
import { ForwardIcon } from '../icons/ForwardIcon';
import { skipSong } from '../services/player-commands';

function SkipSongButton() {
  const handleClick = () => {
    skipSong();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="bg-green-400 rounded-full p-2 hover:bg-green-600 text-xl"
    >
      <ForwardIcon />
    </button>
  );
}
export { SkipSongButton };
