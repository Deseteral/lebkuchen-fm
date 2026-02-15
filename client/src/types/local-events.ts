import type { PlayerState } from './player-state';
import { EventData } from './event-data';

enum LocalEventTypes {
  LocalPlayerStateUpdate = 'LocalPlayerStateUpdate',
  LocalWebsocketConnectionReady = 'LocalWebsocketConnectionReady',
}

interface LocalPlayerStateUpdateEvent {
  id: LocalEventTypes.LocalPlayerStateUpdate;
  state: PlayerState | null;
}

interface LocalWebsocketConnectionReadyEvent {
  id: LocalEventTypes.LocalWebsocketConnectionReady;
}

type LocalEvent = EventData | LocalPlayerStateUpdateEvent | LocalWebsocketConnectionReadyEvent;

export {
  LocalEventTypes,
  type LocalEvent,
  type LocalPlayerStateUpdateEvent,
  type LocalWebsocketConnectionReadyEvent,
};
