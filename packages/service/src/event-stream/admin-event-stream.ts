import { Service } from 'typedi';
import SocketIO from 'socket.io';
import { LogEvent, WsConnectionsEvent } from '@service/event-stream/model/admin-events';
import PlayerEventStream from '@service/event-stream/player-event-stream';
import Logger from '@service/infrastructure/logger';
import { AdminEventData } from '@service/lib';

@Service()
class AdminEventStream {
  private adminNamespace: SocketIO.Namespace;

  constructor(private io: SocketIO.Server, private playerEventStream: PlayerEventStream) {
    this.adminNamespace = this.io.of('/admin');

    this.adminNamespace.on('connection', () => this.adminConnected());
    this.playerEventStream.onPlayerConnection(() => this.playerConnectionChange());
    Logger.on('printedLog', () => this.sendLogsToEveryone());
  }

  public sendToEveryone(event: AdminEventData): void {
    this.adminNamespace.send(event);
  }

  private adminConnected(): void {
    this.sendLogsToEveryone();
    this.sendWsConnections();
  }

  private playerConnectionChange(): void {
    this.sendWsConnections();
  }

  private sendLogsToEveryone(): void {
    const eventData: LogEvent = {
      id: 'LogEvent',
      loggerHistory: Logger.loggerHistory,
    };
    this.sendToEveryone(eventData);
  }

  private sendWsConnections(): void {
    const playerIds = this.playerEventStream.getConnectedPlayerIds();
    const eventData: WsConnectionsEvent = {
      id: 'WsConnectionsEvent',
      playerIds,
    };
    this.sendToEveryone(eventData);
  }
}

export default AdminEventStream;
