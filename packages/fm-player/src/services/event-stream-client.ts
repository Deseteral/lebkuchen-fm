import io from 'socket.io-client';
import { EventData } from 'lebkuchen-fm-service';

interface FMEventMap {
  'fm-command': CustomEvent<EventData>;
}

declare global {
  interface Window {
      addEventListener<K extends keyof FMEventMap>(type: K,
        listener: (this: Window, ev: FMEventMap[K]) => void): void;
      removeEventListener<K extends keyof FMEventMap>(type: K,
        listener: (this: Window, ev: FMEventMap[K]) => void): void;
  }
}

function connect() {
  const client = io('/player');

  client.on('message', (eventData: EventData, sendResponse: Function) => {
    console.log('🎉 Received event from event stream!', eventData);

    const event: CustomEvent<EventData> = new CustomEvent('fm-command', { detail: eventData });

    window.dispatchEvent(event);

    // switch (eventData.id) {
    //   case 'PlayerStateUpdateEvent':
    //     PlayerStateService.setState(eventData.state);
    //     break;

    //   case 'PlayerStateRequestEvent': {
    //     const state = PlayerStateService.getState();
    //     sendResponse(state);
    //   } break;
  });
}

export {
  connect,
};
