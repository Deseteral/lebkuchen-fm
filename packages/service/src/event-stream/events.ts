import PlayerState from '../domain/player-state/player-state';
import Song from '../domain/songs/song';

interface PlayerStateUpdateEvent {
  id: 'PlayerStateUpdateEvent',
  state: PlayerState,
}

interface PlayerStateRequestEvent {
  id: 'PlayerStateRequestEvent',
}

interface AddSongToQueueEvent {
  id: 'AddSongToQueueEvent',
  song: Song,
}

interface PlayXSoundEvent {
  id: 'PlayXSoundEvent',
  soundUrl: string,
}

interface SayEvent {
  id: 'SayEvent',
  text: string,
}

type EventData =
  | PlayerStateUpdateEvent
  | PlayerStateRequestEvent
  | AddSongToQueueEvent
  | PlayXSoundEvent
  | SayEvent;

export {
  EventData,
  PlayerStateRequestEvent,
  PlayerStateUpdateEvent,
  AddSongToQueueEvent,
  PlayXSoundEvent,
  SayEvent,
};
