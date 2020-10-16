import http from 'http';
import socketIo from 'socket.io';
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
    this.io = socketIo(server, { serveClient: false });

    this.playerNamespace = this.io.of('/player');
    this.playerNamespace.on('connection', (socket) => {
      EventStream.logger.info('New user connected to event stream on /player namespace');
      PlayerEventStream.instance.onUserConnected();

      socket.on('disconnect', () => EventStream.logger.info('User disconnected from event stream on /player namespace'));
    });

    this.adminNamespace = this.io.of('/admin');
    AdminEventStream.initialize();
    this.adminNamespace.on('connection', () => {
      AdminEventStream.onUserConnected();
    });
  }

  getPrimaryPlayerSocket(): SocketIO.Socket {
    if (!this.playerNamespace) throw EventStream.notInitializedError;

    const primaryClientId = Object.keys(this.playerNamespace.sockets)[0];
    return this.playerNamespace.sockets[primaryClientId];
  }

  playerBroadcast(eventData: EventData): void {
    if (!this.playerNamespace) throw EventStream.notInitializedError;
    this.playerNamespace.emit('events', eventData);
  }

  adminBroadcast(eventData: AdminEventData): void {
    if (!this.adminNamespace) throw EventStream.notInitializedError;
    this.adminNamespace.emit('admin', eventData);
  }

  getConnectedPlayerCount(): number {
    if (!this.playerNamespace) throw EventStream.notInitializedError;
    return Object.keys(this.playerNamespace.sockets).length;
  }

  private static get notInitializedError(): Error {
    return new Error('Calling EventStream methods before connecting is not allowed');
  }

  static readonly instance = new EventStream();
}

export default EventStream;
