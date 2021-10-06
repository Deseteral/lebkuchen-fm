import http from 'http';
import SocketIO from 'socket.io';
import Logger from '../infrastructure/logger';
import AdminEventStream from './admin-event-stream';
import { AdminEventData } from './model/admin-events';
import { EventData } from './model/events';
import PlayerEventStream from './player-event-stream';

class EventStream {
  private static readonly logger = new Logger('event-stream');
  private io?: SocketIO.Server;

  private playerNamespace?: SocketIO.Namespace;
  private adminNamespace?: SocketIO.Namespace;

  private constructor() { } // eslint-disable-line no-empty-function

  initialize(server: http.Server): void {
    this.io = new SocketIO.Server(server, { serveClient: false });

    this.playerNamespace = this.io.of('/player');
    this.playerNamespace.on('connection', (socket) => {
      EventStream.logger.info('New user connected to event stream on /player namespace');
      PlayerEventStream.instance.onPlayerConnected(socket);
      AdminEventStream.onPlayerConnectionChange();

      socket.on('disconnect', () => {
        EventStream.logger.info('User disconnected from event stream on /player namespace');
        AdminEventStream.onPlayerConnectionChange();
      });
    });

    this.adminNamespace = this.io.of('/admin');
    AdminEventStream.initialize();
    this.adminNamespace.on('connection', () => {
      AdminEventStream.onAdminConnected();
    });
  }

  getPrimaryPlayerSocket(): (SocketIO.Socket | null) {
    if (!this.playerNamespace) throw EventStream.notInitializedError;

    const primaryClientId = this.playerNamespace.sockets.keys().next().value;
    return this.playerNamespace.sockets.get(primaryClientId) || null;
  }

  playerBroadcast(eventData: EventData): void {
    if (!this.playerNamespace) throw EventStream.notInitializedError;
    this.playerNamespace.send(eventData);
  }

  adminBroadcast(eventData: AdminEventData): void {
    if (!this.adminNamespace) throw EventStream.notInitializedError;
    this.adminNamespace.send(eventData);
  }

  getConnectedPlayerCount(): number {
    return this.getConnectedPlayerIds().length;
  }

  getConnectedPlayerIds(): string[] {
    if (!this.playerNamespace) throw EventStream.notInitializedError;
    return Array.from(this.playerNamespace.sockets.keys());
  }

  private static get notInitializedError(): Error {
    return new Error('Calling EventStream methods before connecting is not allowed');
  }

  static readonly instance = new EventStream();
}

export default EventStream;
