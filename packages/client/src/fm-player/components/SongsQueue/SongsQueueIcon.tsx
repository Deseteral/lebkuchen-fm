import React from 'react';
import { CollectionIcon } from '../../icons/CollectionIcon';

interface SongsQueueIconProps {
  onClick: () => void
}

function SongsQueueIcon({ onClick }: SongsQueueIconProps) {
  return (
    <div
      className="absolute right-2 top-16 bg-green-400 hover:bg-green-600 p-3 rounded-full text-black font-bold"
      role="button"
      onClick={onClick}
      tabIndex={0}
      aria-hidden="true"
      title="Songs Queue"
    >
      <CollectionIcon />
    </div>
  );
}

export { SongsQueueIcon };
