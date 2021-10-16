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
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleClick = (): void => {
    setIsExpanded((prevIsExpandedValue) => !prevIsExpandedValue);
  };
  const toggleVisibility = (): void => {
    setIsVisible((prevIsVisibleValue) => !prevIsVisibleValue);
  };
  if (!playerState.queue.length) {
    return null;
  }

  if (!isVisible) {
    return (
      <SongsQueueIcon onClick={toggleVisibility} />
    );
  }

  return (
    <div className="absolute right-2 top-16 max-w-md w-1/4 bg-gray-900 opacity-75 rounded-lg outline-none">
      <div className="sticky top-0 bg-gray-900 leading-none text-white flex rounded-lg items-center justify-between w-full p-4">
        <button type="button" className="absolute hover:text-gray-300 -right-2 -top-2 z-10" onClick={toggleVisibility}>
          <CloseIconSolid />
        </button>
        <button className="hover:text-gray-300" type="button" onClick={handleClick}>
          Queue
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
