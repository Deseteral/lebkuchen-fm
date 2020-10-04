import React, { Dispatch } from 'react';
import { makeDefaultPlayerState, PlayerState } from 'lebkuchen-fm-service';
import { PlayerStateAction } from './player-state-actions';

const INITIAL_STATE: PlayerState = makeDefaultPlayerState();

interface PlayerStateContextT {
  playerState: PlayerState,
  dispatch: Dispatch<PlayerStateAction>,
}

const PlayerStateContext = React.createContext<PlayerStateContextT>({
  playerState: INITIAL_STATE,
  dispatch: (_: PlayerStateAction) => {},
});

export default PlayerStateContext;
export { INITIAL_STATE };
