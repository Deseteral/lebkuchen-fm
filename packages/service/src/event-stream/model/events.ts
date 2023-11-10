import { PlayerState } from '@service/domain/player-state/player-state';
import { Song } from '@service/domain/songs/song';

export interface PlayerStateUpdateEvent {
  id: 'PlayerStateUpdateEvent',
  state: PlayerState,
}

export interface PlayerStateRequestEvent {
  id: 'PlayerStateRequestEvent',
}

export interface AddSongsToQueueEvent {
  id: 'AddSongsToQueueEvent',
  songs: Song[],
}
export interface ReplaceQueueEvent {
  id: 'ReplaceQueueEvent',
  songs: Song[],
}

export interface PlayXSoundEvent {
  id: 'PlayXSoundEvent',
  soundUrl: string,
}

export interface SayEvent {
  id: 'SayEvent',
  text: string,
}

export interface PlayPauseEvent {
  id: 'PlayPauseEvent',
}

export interface SkipEvent {
  id: 'SkipEvent',
  skipAll: boolean,
  amount: number,
}

export type SpeedControl = (-1 | 0 | 1);
export interface ChangeSpeedEvent {
  id: 'ChangeSpeedEvent',
  nextSpeed: SpeedControl,
}

export interface ChangeVolumeEvent {
  id: 'ChangeVolumeEvent',
  isRelative: boolean,
  nextVolume: number,
}

export interface RewindEvent {
  id: 'RewindEvent',
  time: number,
  modifier: number | null,
}

export interface ConnectedUsersEvent {
  id: 'ConnectedUsersEvent',
  connectedUsers: string[],
}

export type EventData =
  | PlayerStateUpdateEvent
  | PlayerStateRequestEvent
  | AddSongsToQueueEvent
  | PlayXSoundEvent
  | SayEvent
  | PlayPauseEvent
  | SkipEvent
  | ChangeSpeedEvent
  | ChangeVolumeEvent
  | ReplaceQueueEvent
  | RewindEvent
  | ConnectedUsersEvent;
