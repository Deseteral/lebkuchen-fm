import PlayerState from '../domain/player-state';
import Song from '../songs/song';

interface PlayerStateUpdateEvent {
  id: 'PlayerStateUpdateEvent',
  state: PlayerState,
}

interface PlayerStateRequestEvent {
  id: 'PlayerStateRequestEvent',
}

interface AddSongToQueueRequestEvent {
  id: 'AddSongToQueueRequestEvent',
  song: Song,
}

type EventData =
  | PlayerStateUpdateEvent
  | PlayerStateRequestEvent
  | AddSongToQueueRequestEvent;

export {
  EventData,
  PlayerStateRequestEvent,
  PlayerStateUpdateEvent,
  AddSongToQueueRequestEvent,
};
