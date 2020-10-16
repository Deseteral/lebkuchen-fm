import { Log } from '../../infrastructure/logger';

interface LogEvent {
  id: 'LogEvent',
  loggerHistory: Log[],
}

type AdminEventData =
  | LogEvent;

export {
  AdminEventData,
  LogEvent,
};
