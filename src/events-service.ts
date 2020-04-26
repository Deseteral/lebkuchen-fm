import WebSocket from 'ws';

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
  time: string;
  queue: string[];
}

const EMPTY_PLAYER_STATE: PlayerState = {
  time: '00:00',
  queue: [],
};

const connectionPool : {[wsid: string]: WebSocket} = {};

function processEventData(eventData: EventData, wsid: string) {
  console.log(eventData, wsid);
}

function connectionOpened(wsid: string, ws: WebSocket) {
  connectionPool[wsid] = ws;
}

function connectionClosed(wsid: string) {
  delete connectionPool[wsid];
}

function sendPlayerState(receiverWsid: string) {
  const connectionPoolKeys = Object.keys(connectionPool);
  const sourceWsid = connectionPoolKeys.find((wsid) => (wsid !== receiverWsid));

  if (!sourceWsid) {
    const eventData: PlayerStateUpdateEvent = {
      id: 'PLAYER_STATE_UPDATE',
      state: EMPTY_PLAYER_STATE,
    };
    connectionPool[receiverWsid].send(eventData);
  }
}

export {
  EventData,
  processEventData,
  connectionOpened,
  connectionClosed,
  connectionPool,
};
