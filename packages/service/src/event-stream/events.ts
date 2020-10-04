import PlayerState from '../domain/player-state';

const PLAYER_STATE_UPDATE = 'PLAYER_STATE_UPDATE';
interface PlayerStateUpdateEvent {
  id: typeof PLAYER_STATE_UPDATE,
  state: PlayerState,
}

const PLAYER_STATE_REQUEST = 'PLAYER_STATE_REQUEST';
interface PlayerStateRequestEvent {
  id: typeof PLAYER_STATE_REQUEST,
}

type EventData = (PlayerStateUpdateEvent | PlayerStateRequestEvent);

export {
  EventData,
  PlayerStateRequestEvent,
  PlayerStateUpdateEvent,
};
