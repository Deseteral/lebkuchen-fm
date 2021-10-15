import React from 'react';
import ListIcon from '../../icons/ListIcon';

function SongsQueueIcon({ onClick }: any) {
  return (
    <div
      className="absolute right-2 top-16 bg-green-400 p-4 rounded-full"
      role="button"
      onClick={onClick}
      tabIndex={0}
      aria-hidden="true"
      title="Zobacz kolejkę odtwarzania"
    >
      <ListIcon />
    </div>
  );
}

export default SongsQueueIcon;
