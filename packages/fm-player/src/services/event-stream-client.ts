import io from 'socket.io-client';
import { EventData } from 'lebkuchen-fm-service';
import * as PlayerStateService from './player-state-service';

function connect() {
  const client = io('/');

  client.on('events', (eventData: EventData, sendResponse: Function) => {
    switch (eventData.id) {
      case 'PlayerStateUpdateEvent':
        PlayerStateService.setState(eventData.state);
        console.log('new state', eventData.state);
        break;

      case 'PlayerStateRequestEvent': {
        const state = PlayerStateService.getState();
        console.log(state);
        sendResponse(state);
      } break;

      case 'AddSongToQueueRequestEvent':
        PlayerStateService.addToQueue(eventData.song);
        break;

      default:
        break;
    }
  });
}

export {
  connect,
};
