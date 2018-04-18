import http from 'http';
import socketIo from 'socket.io';
import QueueMessage from '../domain/io-messages/QueueMessage';

let io: (socketIo.Server | null) = null;

function connect(server: http.Server) {
  io = socketIo(server);
  io.on('connection', () => console.log('New socket connected!'));
}

function broadcast(channel: string, message: (QueueMessage)) {
  if (!io) return;
  io.sockets.emit(channel, message);
}

export default {
  connect,
  broadcast,
};
