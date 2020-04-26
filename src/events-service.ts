import socketIo from 'socket.io';

const PLAYER_STATE_UPDATE = 'PLAYER_STATE_UPDATE';
interface PlayerStateUpdateEvent {
  id: typeof PLAYER_STATE_UPDATE;
  state: PlayerState;
}

const PLAYER_STATE_REQUEST = 'PLAYER_STATE_REQUEST';
interface PlaterStateRequestEvent {
  id: typeof PLAYER_STATE_REQUEST;
}

type EventData = (PlayerStateUpdateEvent | PlaterStateRequestEvent);

interface PlayerState {
  time: number;
}

const EMPTY_PLAYER_STATE: PlayerState = {
  time: 0,
};

function onUserConnected(socket: socketIo.Socket, io: socketIo.Server) {
  const connectedSocketCount = Object.keys(io.sockets.sockets).length;

  if (connectedSocketCount <= 1) {
    const eventData: PlayerStateUpdateEvent = {
      id: 'PLAYER_STATE_UPDATE',
      state: EMPTY_PLAYER_STATE,
    };
    socket.emit('events', eventData);
  } else {
    const reqEventData: PlaterStateRequestEvent = {
      id: 'PLAYER_STATE_REQUEST',
    };
    const primaryClientId = Object.keys(io.sockets.sockets)[0];
    const primaryClient = io.sockets.sockets[primaryClientId]; // TODO: This looks like a hack
    primaryClient.emit('events', reqEventData, (primaryClientState: PlayerState) => {
      const updateEventData: PlayerStateUpdateEvent = {
        id: 'PLAYER_STATE_UPDATE',
        state: primaryClientState,
      };
      socket.emit('events', updateEventData);
    });
  }
}

export {
  EventData,
  onUserConnected,
};
