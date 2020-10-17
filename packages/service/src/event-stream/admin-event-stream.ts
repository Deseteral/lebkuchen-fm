import EventStream from './event-stream';
import { AdminEventData, LogEvent } from './model/admin-events';
import Logger from '../infrastructure/logger';

class AdminEventStream {
  static initialize(): void {
    Logger.on('printedLog', () => {
      AdminEventStream.sendLogsToEveryone();
    });
  }

  private static sendLogsToEveryone(): void {
    const eventData: LogEvent = {
      id: 'LogEvent',
      loggerHistory: Logger.loggerHistory,
    };
    AdminEventStream.sendToEveryone(eventData);
  }

  static onUserConnected(): void {
    AdminEventStream.sendLogsToEveryone();
  }

  static sendToEveryone(event: AdminEventData): void {
    EventStream.instance.adminBroadcast(event);
  }
}

export default AdminEventStream;
