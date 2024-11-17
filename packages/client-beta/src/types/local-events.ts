import type { PlayerState } from './player-state';
import { EventData } from './event-data';

enum LocalEventTypes {
  LocalPlayerStateUpdate = 'LocalPlayerStateUpdate',
}

interface LocalPlayerStateUpdateEvent {
  id: LocalEventTypes.LocalPlayerStateUpdate;
  state: PlayerState;
}

type LocalEvent = EventData | LocalPlayerStateUpdateEvent;

export { LocalEventTypes, type LocalEvent, type LocalPlayerStateUpdateEvent };
