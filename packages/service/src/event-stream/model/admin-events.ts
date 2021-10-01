import { Log } from '../../infrastructure/logger';

interface LogEvent {
  id: 'LogEvent',
  loggerHistory: Log[],
}

interface WsConnectionsEvent {
  id: 'WsConnectionsEvent',
  playerIds: string[],
}

type AdminEventData =
  | LogEvent
  | WsConnectionsEvent;

export {
  AdminEventData,
  LogEvent,
  WsConnectionsEvent,
};
