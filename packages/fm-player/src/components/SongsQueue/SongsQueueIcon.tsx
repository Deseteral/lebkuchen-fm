import React from 'react';
import { MdOutlineQueueMusic } from 'react-icons/md';

interface SongsQueueIconProps {
  onClick: () => void
}

function SongsQueueIcon({ onClick }: SongsQueueIconProps) {
  return (
    <div
      className="absolute right-2 top-16 bg-green-400 hover:bg-green-600 p-3 rounded-full"
      role="button"
      onClick={onClick}
      tabIndex={0}
      aria-hidden="true"
      title="Songs Queue"
    >
      <MdOutlineQueueMusic size="24" color="white" />
    </div>
  );
}

export default SongsQueueIcon;
