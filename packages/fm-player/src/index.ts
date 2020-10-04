import io from 'socket.io-client';
import { EventData } from 'lebkuchen-fm-service';

const client = io('/');

let state = { time: 0 };

client.on('events', (eventData: EventData, responseCb: Function) => {
  switch (eventData.id) {
    case 'PLAYER_STATE_UPDATE':
      console.log('my new state', eventData.state);
      state = eventData.state;
      break;
    case 'PLAYER_STATE_REQUEST':
      console.log('sending state', state);
      responseCb(state);
      break;
    default: break;
  }
});

setInterval(() => {
  state.time += 1;
  const timeEl = document.getElementById('time');
  if (timeEl) {
    timeEl.innerHTML = state.time.toString();
  }
}, 1000);
