import type { PlayerState } from './player-state';
import { EventData } from './event-data';

enum LocalEventTypes {
  LocalPlayerStateUpdate = 'LocalPlayerStateUpdate',
  LocalWebSocketConnectionReady = 'LocalWebSocketConnectionReady',
}

interface LocalPlayerStateUpdateEvent {
  id: LocalEventTypes.LocalPlayerStateUpdate;
  state: PlayerState | null;
}

interface LocalWebSocketConnectionReadyEvent {
  id: LocalEventTypes.LocalWebSocketConnectionReady;
}

type LocalEvent = EventData | LocalPlayerStateUpdateEvent | LocalWebSocketConnectionReadyEvent;

export {
  LocalEventTypes,
  type LocalEvent,
  type LocalPlayerStateUpdateEvent,
  type LocalWebSocketConnectionReadyEvent,
};
