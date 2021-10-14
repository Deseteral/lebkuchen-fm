import * as React from 'react';
import { PlayerState } from 'lebkuchen-fm-service';
import ShowDetailsButton from './ShowDetailsButton';
import PlayerDetails from './PlayerDetails';

interface NowPlayingProps {
  playerState: PlayerState,
}

function NowPlaying({ playerState }: NowPlayingProps) {
  const [showDetails, setShowDetails] = React.useState<boolean>(true);

  if (!playerState.currentlyPlaying) {
    return null;
  }
  if (!showDetails) {
    return (<ShowDetailsButton onClick={() => setShowDetails(true)} />);
  }

  const currentSongTitle = playerState.currentlyPlaying.song?.name || '';
  const nextSongTitle = playerState.queue.length ? playerState?.queue[0].name : '';
  const { isPlaying } = playerState;

  return (
    <PlayerDetails
      onClose={() => setShowDetails(false)}
      currentSongTitle={currentSongTitle}
      nextSongTitle={nextSongTitle}
      isPlaying={isPlaying}
    />
  );
}

export default NowPlaying;
