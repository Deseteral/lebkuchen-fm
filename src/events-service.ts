import WebSocket from 'ws';

interface EventData {
  id: string;
}

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

export {
  EventData,
  processEventData,
  connectionOpened,
  connectionClosed,
  connectionPool,
};
