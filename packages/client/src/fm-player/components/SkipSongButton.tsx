import * as React from 'react';
import { ForwardIcon } from '../icons/ForwardIcon';
import { runSkipCommand } from '../services/player-commands';

function SkipSongButton() {
  const handleClick = () => {
    runSkipCommand();
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
