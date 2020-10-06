import socketIo from 'socket.io';
import PlayerState, { makeDefaultPlayerState } from '../domain/player-state/player-state';
import * as EventStream from './event-stream';
import { EventData, PlayerStateRequestEvent, PlayerStateUpdateEvent } from './events';

// TODO: Sort event-stream package into correct folder

function getPrimaryClientSocket(): SocketIO.Socket {
  const ioServer = EventStream.socketIoServer();
  const primaryClientId = Object.keys(ioServer.sockets.sockets)[0];
  const primaryClient = ioServer.sockets.sockets[primaryClientId]; // TODO: This looks like a hack
  return primaryClient;
}

function sendDefaultPlayerState(socket: socketIo.Socket): void {
  const eventData: PlayerStateUpdateEvent = {
    id: 'PlayerStateUpdateEvent',
    state: makeDefaultPlayerState(),
  };
  socket.emit('events', eventData);
}

function requestAndSendPlayerState(socket: socketIo.Socket): void {
  const reqEventData: PlayerStateRequestEvent = { id: 'PlayerStateRequestEvent' };
  const primaryClient = getPrimaryClientSocket();

  primaryClient.emit('events', reqEventData, (primaryClientState: PlayerState) => {
    const updateEventData: PlayerStateUpdateEvent = {
      id: 'PlayerStateUpdateEvent',
      state: primaryClientState,
    };
    socket.emit('events', updateEventData);
  });
}

function onUserConnected(socket: socketIo.Socket): void {
  const connectedSocketCount = Object.keys(EventStream.socketIoServer().sockets.sockets).length;

  if (connectedSocketCount <= 1) {
    sendDefaultPlayerState(socket);
  } else {
    requestAndSendPlayerState(socket);
  }
}

function broadcast(eventData: EventData): void {
  EventStream.socketIoServer().sockets.emit('events', eventData);
}

export {
  onUserConnected,
  broadcast,
};
