import io from 'socket.io-client';
import { EventData } from 'lebkuchen-fm-service';
import * as PlayerStateService from './player-state-service';

function connect() {
  const client = io('/');
  client.on('connect', () => console.log('Connected to event stream WebSocket'));

  client.on('events', (eventData: EventData, sendResponse: Function) => {
    console.log('Received event from event stream', eventData);

    switch (eventData.id) {
      case 'PlayerStateUpdateEvent':
        PlayerStateService.setState(eventData.state);
        break;

      case 'PlayerStateRequestEvent': {
        const state = PlayerStateService.getState();
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
