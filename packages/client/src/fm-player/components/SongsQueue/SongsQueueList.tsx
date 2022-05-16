import React from 'react';

interface SongsQueueListProps {
  songsQueue: Array<any>
}

function SongsQueueList({ songsQueue }: SongsQueueListProps) {
  return (
    <ol className="overflow-y-auto px-4 max-h-52 custom-scrollbar list-decimal list-inside">
      {
        songsQueue.map(({ id, name }) => (
          <li className="leading-none text-gray-200 py-4" key={id}>
            { name }
          </li>
        ))
      }
    </ol>
  );
}
export { SongsQueueList };
