import * as React from 'react';
import { playerStateReducer } from './player-state-actions';
import PlayerStateContext, { INITIAL_STATE } from './player-state-context';

interface PlayerStateProviderProps { }
function PlayerStateProvider(props: PlayerStateProviderProps) {
  const [playerState, dispatch] = React.useReducer(playerStateReducer, INITIAL_STATE);

  return (
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    <PlayerStateContext.Provider value={{ playerState, dispatch }} {...props} />
  );
}

export default PlayerStateProvider;
