import EventStream from './event-stream';
import { AdminEventData, LogEvent, WsConnectionsEvent } from './model/admin-events';
import Logger from '../infrastructure/logger';

class AdminEventStream {
  static initialize(): void {
    Logger.on('printedLog', () => {
      AdminEventStream.sendLogsToEveryone();
    });
  }

  static onAdminConnected(): void {
    AdminEventStream.sendLogsToEveryone();
    AdminEventStream.sendWsConnections();
  }

  static onPlayerConnectionChange(): void {
    AdminEventStream.sendWsConnections();
  }

  private static sendLogsToEveryone(): void {
    const eventData: LogEvent = {
      id: 'LogEvent',
      loggerHistory: Logger.loggerHistory,
    };
    AdminEventStream.sendToEveryone(eventData);
  }

  private static sendWsConnections(): void {
    const playerIds = EventStream.instance.getConnectedPlayerIds();
    const eventData: WsConnectionsEvent = {
      id: 'WsConnectionsEvent',
      playerIds,
    };
    AdminEventStream.sendToEveryone(eventData);
  }

  private static sendToEveryone(event: AdminEventData): void {
    EventStream.instance.adminBroadcast(event);
  }
}

export default AdminEventStream;
