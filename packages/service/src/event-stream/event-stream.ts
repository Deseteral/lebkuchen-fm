import http from 'http';
import socketIo from 'socket.io';
import * as Logger from '../infrastructure/logger';
import * as EventStreamService from './event-stream-service';

let io: SocketIO.Server;

function newConnectionHandler(socket: socketIo.Socket): void {
  Logger.info('New user connected to event stream', 'event-stream');
  EventStreamService.onUserConnected(socket);

  socket.on('disconnect', () => Logger.info('User disconnected from event stream', 'event-stream'));
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

function socketIoServer(): SocketIO.Server {
  return io;
}

export {
  initialize,
  socketIoServer,
  getPrimaryClientSocket,
};
