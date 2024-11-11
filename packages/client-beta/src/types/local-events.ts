import type { PlayerState } from './player-state';
import type { EventData } from '@service/event-stream/model/events';

enum LocalEventTypes {
  LocalPlayerStateUpdate = 'LocalPlayerStateUpdate',
  PlayerStateRequestEventResponse = 'PlayerStateRequestEventResponse',
}

interface LocalPlayerStateUpdateEvent {
  id: LocalEventTypes.LocalPlayerStateUpdate;
  state: PlayerState;
}

interface PlayerStateRequestEventResponse {
  id: LocalEventTypes.PlayerStateRequestEventResponse;
  state: PlayerState;
}

type LocalEvent = EventData | LocalPlayerStateUpdateEvent | PlayerStateRequestEventResponse;

export {
  LocalEventTypes,
  type LocalEvent,
  type LocalPlayerStateUpdateEvent,
  type PlayerStateRequestEventResponse,
};
