import EventStream from './event-stream';
import { AdminEventData, LogEvent } from './model/admin-events';
import Logger from '../infrastructure/logger';

class AdminEventStream {
  static onUserConnected(): void {
    const eventData: LogEvent = {
      id: 'LogEvent',
      loggerHistory: Logger.loggerHistory,
    };
    AdminEventStream.sendToEveryone(eventData);
  }

  static sendToEveryone(event: AdminEventData): void {
    EventStream.instance.adminBroadcast(event);
  }
}

export default AdminEventStream;
