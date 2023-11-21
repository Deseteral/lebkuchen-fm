import * as React from 'react';
import { PlayerState } from 'lebkuchen-fm-service';
import { YouTubePlayer } from './YouTubePlayer';
import * as EventStreamClient from '../services/event-stream-client';
import * as SpeechService from '../services/speech-service';
import { NowPlaying } from './NowPlaying/NowPlaying';
import * as PlayerStateService from '../services/player-state-service';
import { SongsQueue } from './SongsQueue/SongsQueue';
import { SoundBoardWidget } from './SoundBoardWidget';
import { RandomSongButton } from './RandomSongButton';
import { SkipSongButton } from './SkipSongButton';
import { ShowNowPlayingButton } from './NowPlaying/ShowNowPlayingButton';
import { Search } from './Search';
import { UsersButton } from './UsersButton';

function FmPlayer() {
  const [playerState, setPlayerState] = React.useState<PlayerState | null>(null);
  const [showNowPlaying, setShowNowPlaying] = React.useState<boolean>(true);

  React.useEffect(() => {
    const eventStreamDisconnect = EventStreamClient.connect();
    SpeechService.initialize();

    PlayerStateService.onStateChange((nextState?: PlayerState) => {
      if (!nextState) return;
      setPlayerState({
        currentlyPlaying: nextState.currentlyPlaying,
        queue: nextState.queue,
        isPlaying: nextState.isPlaying,
      } as PlayerState);
    });

    return () => eventStreamDisconnect();
  }, []);

  if (playerState === null) return (<div />);

  return (
    <div className="relative">
      <SongsQueue playerState={playerState} />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-start gap-4 overflow-x-visible">
        <Search />
        <RandomSongButton />
        {playerState && !showNowPlaying && <ShowNowPlayingButton onClick={() => setShowNowPlaying(true)} />}
        <SkipSongButton />
        <UsersButton />
      </div>
      <SoundBoardWidget />
      <YouTubePlayer />
      {showNowPlaying && <NowPlaying playerState={playerState} onClose={() => setShowNowPlaying(false)} />}
    </div>
  );
}

export { FmPlayer };
