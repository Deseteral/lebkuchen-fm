import http from 'http';
import socketIo from 'socket.io';
import Logger from '../infrastructure/logger';
import * as EventStreamService from './event-stream-service';
import { EventData } from './model/events';

const logger = new Logger('event-stream');

let io: SocketIO.Server;

function newConnectionHandler(socket: socketIo.Socket): void {
  logger.info('New user connected to event stream');
  EventStreamService.onUserConnected(socket);

  socket.on('disconnect', () => logger.info('User disconnected from event stream'));
}

function initialize(server: http.Server): void {
  io = socketIo(server);
  io.on('connection', newConnectionHandler);
}

function getPrimaryClientSocket(): SocketIO.Socket {
  const primaryClientId = Object.keys(io.sockets.sockets)[0];
  const primaryClient = io.sockets.sockets[primaryClientId];
  return primaryClient;
}

function broadcast(eventData: EventData): void {
  io.sockets.emit('events', eventData);
}

function getConnectedSocketCount(): number {
  return Object.keys(io.sockets.sockets).length;
}

export {
  initialize,
  getPrimaryClientSocket,
  broadcast,
  getConnectedSocketCount,
};
