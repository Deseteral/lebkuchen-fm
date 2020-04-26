import http from 'http';
import socketIo from 'socket.io';
import * as EventsService from './events-service';

function initialize(server: http.Server) {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('a user connected');
    EventsService.onUserConnected(socket, io);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

export {
  initialize,
};
