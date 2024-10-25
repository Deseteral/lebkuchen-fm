import { io } from 'socket.io-client';
import { EventData } from 'lebkuchen-fm-service';
import mitt from 'mitt';

type DisconnectedCallback = () => void;

const emmiter = mitt();

function connect(): DisconnectedCallback {
  const client = io('/api/player');

  client.on('connect', () => console.log('Connected to event stream WebSocket'));

  client.on('message', (eventData: EventData) => {
    emmiter.emit(eventData.id, eventData);
  });


  return function disconnect() {
    client.disconnect();
  }
}


export {
  connect,
  emmiter,
}
