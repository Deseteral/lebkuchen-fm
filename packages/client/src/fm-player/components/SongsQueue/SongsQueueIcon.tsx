import React from 'react';
import { CollectionIcon } from '../../icons/CollectionIcon';

interface SongsQueueIconProps {
  onClick: () => void
}

function SongsQueueIcon({ onClick }: SongsQueueIconProps) {
  return (
    <button
      className="absolute left-3 top-16 p-2 bg-green-400 text-2xl hover:bg-green-600 rounded-full text-black font-bold"
      type="button"
      onClick={onClick}
      title="Songs Queue"
    >
      <CollectionIcon />
    </button>
  );
}

export { SongsQueueIcon };
