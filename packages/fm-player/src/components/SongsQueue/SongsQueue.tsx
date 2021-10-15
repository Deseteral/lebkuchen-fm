import React, { useState } from 'react';
import PlayerState from '@service/domain/player-state/player-state';
import SongsQueueList from './SongsQueueList';
import ExpandIcon from '../../icons/ExpandIcon';
import CloseIconSolid from '../../icons/CloseIconSolid';
import SongsQueueIcon from './SongsQueueIcon';

interface SongsQueueProps {
  playerState: PlayerState,
}

function SongsQueue({ playerState }: SongsQueueProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleClick = (): void => {
    setIsExpanded((prevState) => !prevState);
  };
  const toggleVisibility = (): void => {
    setIsVisible((prevState) => !prevState);
  };

  if (!playerState.queue.length || isVisible) {
    console.log('IKONA');
    return (
      <SongsQueueIcon onClick={toggleVisibility} />
    );
  }

  return (
    <div className="absolute max-w-md w-1/4 bg-gray-900 opacity-90 rounded-lg outline-none right-2 top-16">
      <div className="sticky bg-gray-900 top-0 leading-none text-white flex rounded-lg items-center justify-between w-full p-4">
        <button type="button" className="absolute opacity-50 hover:opacity-90 -right-2 -top-2 z-10" onClick={toggleVisibility}>
          <CloseIconSolid />
        </button>
        <button className="hover:text-gray-300" type="button" onClick={handleClick}>
          Kolejka
        </button>
        <button className="hover:text-gray-300" type="button" onClick={handleClick}>
          <ExpandIcon isRotated={isExpanded} />
        </button>
      </div>
      {isExpanded && (<SongsQueueList songsQueue={playerState.queue} />)}
    </div>
  );
}

export default SongsQueue;
