import React from 'react';

interface SongsQueueListProps {
  songsQueue: Array<any>
}

function SongsQueueList({ songsQueue }: SongsQueueListProps) {
  return (
    <div className="overflow-y-auto px-4 max-h-52 custom-scrollbar">
      {
        songsQueue.map(({ id, name }, index) => (
          <div className="leading-none text-gray-200 py-4" key={id}>
            {
              `${index + 1}. ${name}`
            }
          </div>
        ))
      }
    </div>
  );
}
export default SongsQueueList;
