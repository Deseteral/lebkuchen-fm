import EventStream from './event-stream';
import { AdminEventData, LogEvent, WsConnectionsEvent } from './model/admin-events';
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

  static onAdminConnected(): void {
    AdminEventStream.sendLogsToEveryone();
  }

  static onPlayerConnectionChange(): void {
    const playerIds = EventStream.instance.getConnectedPlayerIds();
    const eventData: WsConnectionsEvent = {
      id: 'WsConnectionsEvent',
      playerIds,
    };
    AdminEventStream.sendToEveryone(eventData);
  }

  static sendToEveryone(event: AdminEventData): void {
    EventStream.instance.adminBroadcast(event);
  }
}

export default AdminEventStream;
