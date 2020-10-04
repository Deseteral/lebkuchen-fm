import io from 'socket.io-client';
import { EventData } from 'lebkuchen-fm-service';

function connect() {
  const client = io('/');

  client.on('events', (eventData: EventData, responseCb: Function) => {
    switch (eventData.id) {
      case 'PLAYER_STATE_UPDATE':
        console.log('my new state', eventData.state);
        break;
      case 'PLAYER_STATE_REQUEST':
        console.log('sending state');
        // responseCb(state);
        break;
      default: break;
    }
  });
}

export {
  connect,
};
