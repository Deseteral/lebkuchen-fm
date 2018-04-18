import http from 'http';
import socketIo from 'socket.io';
import QueueMessage from '../domain/io-messages/QueueMessage';
import SayMessage from '../domain/io-messages/SayMessage';
import Song from '../domain/Song';
import IoController from '../controllers/IoController';

let io: (socketIo.Server | null) = null;

function connect(server: http.Server) {
  io = socketIo(server);
  io.on('connection', (socket: socketIo.Socket) => {
    console.log('New socket connected!');

    socket.on('song-played', (song: Song) => {
      IoController.songPlayed(song.youtubeId);
    });
  });
}

function broadcast(channel: string, message: (QueueMessage | SayMessage)) {
  if (!io) return;
  io.sockets.emit(channel, message);
}

export default {
  connect,
  broadcast,
};
