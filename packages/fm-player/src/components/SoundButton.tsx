import * as React from 'react';

interface SoundButtonProps {
  name: string,
  timesPlayed: number,
  onClick: () => void,
}

function getBgColor(timesPlayed: number = 0) {
  if (timesPlayed > 200) return 'bg-blue-900 hover:bg-blue-900 text-white';
  if (timesPlayed > 100) return 'bg-blue-700 hover:bg-blue-800 text-white';
  if (timesPlayed > 50) return 'bg-blue-500 hover:bg-blue-600 text-white';
  if (timesPlayed > 20) return 'bg-blue-300 hover:bg-blue-400 text-blue-900';
  return 'bg-blue-100 hover:bg-blue-200 text-blue-900';
}

function SoundButton({ name, timesPlayed, onClick }: SoundButtonProps) {
  return (
    <button
      className={`${getBgColor(timesPlayed)} text-bl font-bold py-2 px-4 rounded-full m-4`}
      type="button"
      onClick={onClick}
    >
      {name}
    </button>
  );
}

export default SoundButton;
