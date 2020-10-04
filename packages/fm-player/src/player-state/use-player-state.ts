import React from 'react';
import { PlayerState, Song } from 'lebkuchen-fm-service';
import PlayerStateContext from './player-state-context';

interface UsePlayerStateT {
  playerState: PlayerState,
  replaceState: (nextState: PlayerState) => void,
  updateQueue: (nextQueue: Song[]) => void,
}

function usePlayerState(): UsePlayerStateT {
  const context = React.useContext(PlayerStateContext);
  if (!context) throw new Error('usePlayerState must be used within a PlayerStateProvider');

  const { playerState, dispatch } = context;
  const replaceState = (nextState: PlayerState) => dispatch({ type: 'ReplacePlayerStateAction', nextState });
  const updateQueue = (nextQueue: Song[]) => dispatch({ type: 'UpdateQueuePlayerStateAction', nextQueue });

  return {
    playerState,
    replaceState,
    updateQueue,
  };
}

export default usePlayerState;
