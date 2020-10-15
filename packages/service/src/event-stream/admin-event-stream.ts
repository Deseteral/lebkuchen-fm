import EventStream from './event-stream';
import { AdminEventData, LogEvent } from './model/admin-events';
import Logger from '../infrastructure/logger';

class AdminEventStream {
  // private eventStream: EventStream;

  // private constructor() {
  //   this.eventStream = EventStream.instance;
  // }

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

  static readonly instance = new AdminEventStream();
}

export default AdminEventStream;
