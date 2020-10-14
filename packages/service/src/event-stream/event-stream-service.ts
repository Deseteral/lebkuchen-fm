import socketIo from 'socket.io';
import PlayerState, { makeDefaultPlayerState } from '../domain/player-state/player-state';
import * as EventStream from './event-stream';
import { EventData, PlayerStateRequestEvent, PlayerStateUpdateEvent } from './model/events';

function sendDefaultPlayerState(socket: socketIo.Socket): void {
  const eventData: PlayerStateUpdateEvent = {
    id: 'PlayerStateUpdateEvent',
    state: makeDefaultPlayerState(),
  };
  socket.emit('events', eventData);
}

function requestAndSendPlayerState(socket: socketIo.Socket): void {
  const reqEventData: PlayerStateRequestEvent = { id: 'PlayerStateRequestEvent' };
  const primaryClient = EventStream.getPrimaryClientSocket();

  primaryClient.emit('events', reqEventData, (primaryClientState: PlayerState) => {
    const updateEventData: PlayerStateUpdateEvent = {
      id: 'PlayerStateUpdateEvent',
      state: primaryClientState,
    };
    socket.emit('events', updateEventData);
  });
}

function onUserConnected(socket: socketIo.Socket): void {
  const connectedSocketCount = EventStream.getConnectedSocketCount();

  if (connectedSocketCount <= 1) {
    sendDefaultPlayerState(socket);
  } else {
    requestAndSendPlayerState(socket);
  }
}

function sendToEveryone(event: EventData): void {
  EventStream.broadcast(event);
}

export {
  onUserConnected,
  sendToEveryone,
};
