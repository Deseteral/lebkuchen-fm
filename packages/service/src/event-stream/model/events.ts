import PlayerState from '../../domain/player-state/player-state';
import Song from '../../domain/songs/song';

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

interface PauseEvent {
  id: 'PauseEvent',
}

interface ResumeEvent {
  id: 'ResumeEvent',
}

interface SkipEvent {
  id: 'SkipEvent',
  skipAll: boolean,
  amount: number,
}

interface ChangeVolumeEvent {
  id: 'ChangeVolumeEvent',
  isRelative: boolean,
  nextVolume: number,
}

type EventData =
  | PlayerStateUpdateEvent
  | PlayerStateRequestEvent
  | AddSongToQueueEvent
  | PlayXSoundEvent
  | SayEvent
  | PauseEvent
  | ResumeEvent
  | SkipEvent
  | ChangeVolumeEvent;

export {
  EventData,
  PlayerStateRequestEvent,
  PlayerStateUpdateEvent,
  AddSongToQueueEvent,
  PlayXSoundEvent,
  SayEvent,
  PauseEvent,
  ResumeEvent,
  SkipEvent,
  ChangeVolumeEvent,
};
