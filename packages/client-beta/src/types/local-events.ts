import type { PlayerState } from './player-state';
import type { EventData } from '@service/event-stream/model/events';

enum LocalEventTypes {
  LOCAL_PLAYER_STATE_UPDATE = 'LocalPlayerStateUpdate',
}

interface LocalPlayerStateUpdateEvent {
  id: LocalEventTypes.LOCAL_PLAYER_STATE_UPDATE;
  state: PlayerState;
}

type LocalEventData = EventData | LocalPlayerStateUpdateEvent;

type LocalEvents = {
  eventData: LocalEventData;
  sendResponse?: (...args: unknown[]) => void;
}

export {
  LocalEventTypes,
  type LocalEventData,
  type LocalPlayerStateUpdateEvent,
  type LocalEvents,
};
