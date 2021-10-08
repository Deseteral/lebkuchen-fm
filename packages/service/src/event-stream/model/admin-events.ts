import { Log } from '../../infrastructure/logger';

export interface LogEvent {
  id: 'LogEvent',
  loggerHistory: Log[],
}

export interface WsConnectionsEvent {
  id: 'WsConnectionsEvent',
  playerIds: string[],
}

export type AdminEventData =
  | LogEvent
  | WsConnectionsEvent;
