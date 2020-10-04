import http from 'http';
import socketIo from 'socket.io';
import * as Logger from '../infrastructure/logger';
import * as EventStreamService from './event-stream-service';

let io: SocketIO.Server;

function newConnectionHandler(socket: socketIo.Socket): void {
  Logger.info('New user connected to event stream', 'event-stream');
  EventStreamService.onUserConnected(socket, io);

  socket.on('disconnect', () => Logger.info('User disconnected from event stream', 'event-stream'));
}

function initialize(server: http.Server): void {
  io = socketIo(server);
  io.on('connection', newConnectionHandler);
}

export {
  initialize,
};
