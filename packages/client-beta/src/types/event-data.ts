import { PlayerState, Song } from './player-state';

export interface PlayerStateRequestEvent {
  id: 'PlayerStateRequestEvent';
}

export interface PlayerStateRequestDonationEvent {
  id: 'PlayerStateRequestDonationEvent';
  requestId: string;
}

export interface PlayerStateUpdateEvent {
  id: 'PlayerStateUpdateEvent';
  state: PlayerState;
}

export interface PlayerStateDonationEvent {
  id: 'PlayerStateDonationEvent';
  requestId: string;
  state: PlayerState;
}

export interface AddSongsToQueueEvent {
  id: 'AddSongsToQueueEvent';
  songs: Song[];
}
export interface ReplaceQueueEvent {
  id: 'ReplaceQueueEvent';
  songs: Song[];
}

export interface PlayXSoundEvent {
  id: 'PlayXSoundEvent';
  soundUrl: string;
}

export interface SayEvent {
  id: 'SayEvent';
  text: string;
}

export interface PlayerResumeEvent {
  id: 'ResumeEvent';
}

export interface PlayerPauseEvent {
  id: 'PauseEvent';
}

export interface SkipEvent {
  id: 'SkipEvent';
  skipAll: boolean;
  amount: number;
}

export type SpeedControl = -1 | 0 | 1;
export interface ChangeSpeedEvent {
  id: 'ChangeSpeedEvent';
  nextSpeed: SpeedControl;
}

export interface ChangeVolumeEvent {
  id: 'ChangeVolumeEvent';
  isRelative: boolean;
  nextVolume: number;
}

export interface RewindEvent {
  id: 'RewindEvent';
  time: number;
  modifier: number | null;
}

export interface SongChangedEvent {
  id: 'SongChanged';
  song: Song;
}

export interface ConnectedUsersEvent {
  id: 'ConnectedUsersEvent';
  connectedUsers: string[];
}

export type EventData =
  | PlayerStateUpdateEvent
  | PlayerStateRequestDonationEvent
  | PlayerStateRequestEvent
  | PlayerStateDonationEvent
  | AddSongsToQueueEvent
  | PlayXSoundEvent
  | SayEvent
  | PlayerPauseEvent
  | PlayerResumeEvent
  | SkipEvent
  | ChangeSpeedEvent
  | ChangeVolumeEvent
  | ReplaceQueueEvent
  | RewindEvent
  | ConnectedUsersEvent
  | SongChangedEvent;
