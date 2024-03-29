import React, { useState } from 'react';
import { PlayerState } from 'lebkuchen-fm-service';
import { SongsQueueList } from './SongsQueueList';
import { ExpandIcon } from '../../icons/ExpandIcon';
import { CloseIconSolid } from '../../icons/CloseIconSolid';
import { SongsQueueIcon } from './SongsQueueIcon';

interface SongsQueueProps {
  playerState: PlayerState,
}

function SongsQueue({ playerState }: SongsQueueProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  if (!playerState || !playerState.queue.length) {
    return null;
  }

  const toggleExpandedView = (): void => {
    setIsExpanded((prevIsExpandedValue) => !prevIsExpandedValue);
  };
  const toggleVisibility = (): void => {
    setIsVisible((prevIsVisibleValue) => !prevIsVisibleValue);
  };
  if (!isVisible) {
    return (
      <SongsQueueIcon onClick={toggleVisibility} />
    );
  }

  return (
    <div className="absolute left-3 top-16 max-w-md w-1/4 bg-green-400/90 rounded-lg outline-none">
      <div className="sticky top-0 leading-none text-black flex rounded-lg items-center justify-between w-full p-4">
        <button type="button" className="absolute hover:opacity-75 -right-4 -top-4 z-10" onClick={toggleVisibility}>
          <CloseIconSolid />
        </button>
        <button className="hover:text-gray-700" type="button" onClick={toggleExpandedView}>
          Kolejka
        </button>
        <button className="hover:text-gray-700" type="button" onClick={toggleExpandedView}>
          <ExpandIcon isRotated={isExpanded} />
        </button>
      </div>
      {isExpanded && (<SongsQueueList songsQueue={playerState.queue} />)}
    </div>
  );
}

export { SongsQueue };
