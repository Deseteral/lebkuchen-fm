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

interface AddSongNow {
  id: 'AddSongNow',
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
}

interface ChangeVolumeEvent {
  id: 'ChangeVolumeEvent',
  nextVolume: number,
}

type EventData =
  | PlayerStateUpdateEvent
  | PlayerStateRequestEvent
  | AddSongToQueueEvent
  | AddSongNow
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
  AddSongNow,
  PlayXSoundEvent,
  SayEvent,
  PauseEvent,
  ResumeEvent,
  SkipEvent,
  ChangeVolumeEvent,
};
