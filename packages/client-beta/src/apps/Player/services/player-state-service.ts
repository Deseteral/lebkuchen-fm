import type { PlayerState } from '../../../types/player-state';
import {
  LocalEventTypes,
  type LocalPlayerStateUpdateEvent,
} from '../../../types/local-events';
import { EventStreamClientService } from '../../../services/event-stream-client-service';

let playerState: PlayerState = {
  currentlyPlaying: null,
  queue: [],
  isPlaying: true,
  volume: 100,
};

function change(newPlayerState: Partial<PlayerState>, propagateEvent: boolean = true): PlayerState {
  playerState = {
    ...playerState,
    ...newPlayerState,
  };

  if (propagateEvent) {
    debouncedSendLocalPlayerStateUpdateEvent();
  }

  return playerState;
}

function get(): PlayerState {
  return { ...playerState };
}


let debounceTimeout: ReturnType<typeof setTimeout> | null;

function debouncedSendLocalPlayerStateUpdateEvent(): void {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    sendLocalPlayerStateUpdateEvent();
    debounceTimeout = null;
  }, 50);
}

function sendLocalPlayerStateUpdateEvent(): void {
  const id = LocalEventTypes.LOCAL_PLAYER_STATE_UPDATE;
  const eventData: LocalPlayerStateUpdateEvent = { id, state: playerState };
  EventStreamClientService.broadcast(id, { eventData });
}

export const PlayerStateService = {
  change,
  get,
}
