import socketIo from 'socket.io';
import PlayerState, { makeDefaultPlayerState } from '../domain/player-state';
import { PlayerStateRequestEvent, PlayerStateUpdateEvent } from './events';

function getPrimaryClientSocket(ioServer: SocketIO.Server): SocketIO.Socket {
  const primaryClientId = Object.keys(ioServer.sockets.sockets)[0];
  const primaryClient = ioServer.sockets.sockets[primaryClientId]; // TODO: This looks like a hack
  return primaryClient;
}

function sendDefaultPlayerState(socket: socketIo.Socket): void {
  const eventData: PlayerStateUpdateEvent = {
    id: 'PLAYER_STATE_UPDATE',
    state: makeDefaultPlayerState(),
  };
  socket.emit('events', eventData);
}

function requestAndSendPlayerState(socket: socketIo.Socket, ioServer: socketIo.Server): void {
  const reqEventData: PlayerStateRequestEvent = { id: 'PLAYER_STATE_REQUEST' };
  const primaryClient = getPrimaryClientSocket(ioServer);

  primaryClient.emit('events', reqEventData, (primaryClientState: PlayerState) => {
    const updateEventData: PlayerStateUpdateEvent = {
      id: 'PLAYER_STATE_UPDATE',
      state: primaryClientState,
    };
    socket.emit('events', updateEventData);
  });
}

function onUserConnected(socket: socketIo.Socket, ioServer: socketIo.Server): void {
  const connectedSocketCount = Object.keys(ioServer.sockets.sockets).length;

  if (connectedSocketCount <= 1) {
    sendDefaultPlayerState(socket);
  } else {
    requestAndSendPlayerState(socket, ioServer);
  }
}

export {
  onUserConnected,
};
