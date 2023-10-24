import * as React from 'react';
import { DiceIcon } from '../icons/DiceIcon';
import { playRandomSongFromHistory } from '../services/player-commands';

function RandomSongButton() {
  const handleClick = () => {
    playRandomSongFromHistory();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-green-400 rounded-full p-2 hover:bg-green-600 text-xl"
    >
      <DiceIcon />
    </button>
  );
}
export { RandomSongButton };
