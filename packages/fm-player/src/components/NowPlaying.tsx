import * as React from 'react';
import { PlayerState } from 'lebkuchen-fm-service';

interface NowPlayingProps {
  playerState: PlayerState | null,
}

function NowPlaying({ playerState }: NowPlayingProps) {
  console.log('asdf');
  console.log(playerState);
  const currentSongTitle = playerState?.currentlyPlaying?.song?.name || '';
  const nextSongTitle = playerState?.queue.length ? playerState?.queue[0].name : '';
  const isPlaying = playerState?.isPlaying;
  return (
    <div className="absolute inset-x-5 bottom-14 flex flex-col p-8 bg-gray-900 opacity-75 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isPlaying && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white p-2 bg-green-500 rounded-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {!isPlaying && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white p-2 bg-red-500 rounded-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <div className="flex flex-col ml-3">
            <div className="font-medium text-xl leading-none text-gray-100"> {currentSongTitle}</div>
            { nextSongTitle.length > 0 && (
              <p className="text-gray-400 text-lg leading-none mt-2"><span className="font-bold italic">Next:</span> {nextSongTitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NowPlaying;
