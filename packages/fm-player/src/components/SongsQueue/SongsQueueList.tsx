import React from 'react';

interface SongsQueueListProps {
  songsQueue: Array<any>
}

function SongsQueueList({ songsQueue }: SongsQueueListProps) {
  console.log(songsQueue);

  return (
    <div className="overflow-y-scroll px-4 max-h-52">
      {
        songsQueue.map(({ id, name }, index) => (
          <div className="leading-none text-gray-200 py-4" key={`${id}-${Math.floor(Math.random() * 10)}`}>{`${index + 1}. ${name}`}</div>
        ))
      }
    </div>
  );
}
export default SongsQueueList;
