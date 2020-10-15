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
  beginning: boolean
}

interface AddNextSongEvent {
  id: 'AddNextSongEvent',
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
  nextVolume: number,
}

type EventData =
  | PlayerStateUpdateEvent
  | PlayerStateRequestEvent
  | AddSongToQueueEvent
  | AddNextSongEvent
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
  AddNextSongEvent,
  PlayXSoundEvent,
  SayEvent,
  PauseEvent,
  ResumeEvent,
  SkipEvent,
  ChangeVolumeEvent,
};
