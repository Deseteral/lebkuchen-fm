import { makeDefaultPlayerState, PlayerState } from 'lebkuchen-fm-service';

let playerState: PlayerState = makeDefaultPlayerState();

function getState() {
  return playerState;
}

function setState(nextState: PlayerState) {
  playerState = nextState;
}

export {
  getState,
  setState,
};
