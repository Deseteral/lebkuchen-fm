import http from 'http';
import socketIo from 'socket.io';
import Song from '../domain/Song';
import IoController from '../controllers/IoController';
import EventMessage from '../domain/event-messages/EventMessage';

let io: (socketIo.Server | null) = null;

function setupSocket(socket: socketIo.Socket) {
  socket.on('song-played', (song: Song) => {
    IoController.songPlayed(song.youtubeId);
  });
}

function connect(server: http.Server) {
  io = socketIo(server);
  io.on('connection', setupSocket);
}

function broadcast(channel: string, message: EventMessage) {
  if (!io) {
    throw new Error('Could not send event: socket.io is not initialized');
  }

  io.sockets.emit(channel, message);
}

export default {
  connect,
  broadcast,
};
