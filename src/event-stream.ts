import http from 'http';
import socketIo from 'socket.io';
import * as Logger from './logger';
import * as EventsService from './events-service';

let io: SocketIO.Server;

function initialize(server: http.Server) {
  io = socketIo(server);

  io.on('connection', (socket) => {
    Logger.get().info('New user connected');
    EventsService.onUserConnected(socket, io);

    socket.on('disconnect', () => {
      Logger.get().info('User disconnected');
    });
  });
}

function getIo() {
  return io;
}

export {
  initialize,
  getIo,
};
