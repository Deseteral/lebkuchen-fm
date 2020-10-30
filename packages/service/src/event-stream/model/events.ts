import PlayerState from '../../domain/player-state/player-state';
import Song from '../../domain/songs/song';

interface PlayerStateUpdateEvent {
  id: 'PlayerStateUpdateEvent',
  state: PlayerState,
}

interface PlayerStateRequestEvent {
  id: 'PlayerStateRequestEvent',
}

interface AddSongsToQueueEvent {
  id: 'AddSongsToQueueEvent',
  songs: Song[],
  atTheBeginning: boolean,
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

type SpeedControl = (-1 | 0 | 1);
interface ChangeSpeedEvent {
  id: 'ChangeSpeedEvent',
  nextSpeed: SpeedControl,
}

interface ChangeVolumeEvent {
  id: 'ChangeVolumeEvent',
  isRelative: boolean,
  nextVolume: number,
}

type EventData =
  | PlayerStateUpdateEvent
  | PlayerStateRequestEvent
  | AddSongsToQueueEvent
  | PlayXSoundEvent
  | SayEvent
  | PauseEvent
  | ResumeEvent
  | SkipEvent
  | ChangeSpeedEvent
  | ChangeVolumeEvent;

export {
  SpeedControl,
  EventData,
  PlayerStateRequestEvent,
  PlayerStateUpdateEvent,
  AddSongsToQueueEvent,
  PlayXSoundEvent,
  SayEvent,
  PauseEvent,
  ResumeEvent,
  SkipEvent,
  ChangeSpeedEvent,
  ChangeVolumeEvent,
};
