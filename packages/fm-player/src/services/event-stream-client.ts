import io from 'socket.io-client';
import { EventData } from 'lebkuchen-fm-service';
import * as PlayerStateService from './player-state-service';

function connect() {
  const client = io('/');

  client.on('events', (eventData: EventData, sendResponse: Function) => {
    switch (eventData.id) {
      case 'PLAYER_STATE_UPDATE':
        PlayerStateService.setState(eventData.state);
        console.log('new state', eventData.state);
        break;

      case 'PLAYER_STATE_REQUEST': {
        const state = PlayerStateService.getState();
        console.log(state);
        sendResponse(state);
      } break;

      default:
        break;
    }
  });
}

export {
  connect,
};
