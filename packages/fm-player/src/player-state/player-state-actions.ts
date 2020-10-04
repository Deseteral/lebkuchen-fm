import { PlayerState } from 'lebkuchen-fm-service';
import Song from 'lebkuchen-fm-service/src/songs/song';

type PlayerStateAction =
  | ReplacePlayerStateAction
  | UpdateQueuePlayerStateAction;

interface ReplacePlayerStateAction {
  type: 'ReplacePlayerStateAction',
  nextState: PlayerState,
}

interface UpdateQueuePlayerStateAction {
  type: 'UpdateQueuePlayerStateAction',
  nextQueue: Song[],
}

function playerStateReducer(state: PlayerState, action: PlayerStateAction): PlayerState {
  switch (action.type) {
    case 'ReplacePlayerStateAction':
      return action.nextState;

    case 'UpdateQueuePlayerStateAction':
      return { ...state, queue: action.nextQueue };

    default:
      return state;
  }
}

export {
  playerStateReducer,
  PlayerStateAction,
};
