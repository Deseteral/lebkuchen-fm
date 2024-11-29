import type { PlayerState } from '../../../types/player-state';
import { LocalEventTypes, type LocalPlayerStateUpdateEvent } from '../../../types/local-events';
import { EventStreamClient } from '../../../services/event-stream-client';

class PlayerStateService {
  // Null when Player has not been initialized
  private static playerState: PlayerState | null = null;
  private static debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  static reset(): void {
    PlayerStateService.playerState = null;
    PlayerStateService.debouncedSendLocalPlayerStateUpdateEvent();
  }

  static initialize(playerState: PlayerState): void {
    if (!playerState) {
      console.log('Player state not initialized: Wrong player state', playerState);
    }

    PlayerStateService.playerState = playerState;
    PlayerStateService.debouncedSendLocalPlayerStateUpdateEvent();
  }

  static get(): PlayerState {
    if (!PlayerStateService.playerState) {
      throw new PlayerStateNotInitializedError();
    }

    return structuredClone(PlayerStateService.playerState);
  }

  static change(newPlayerState: Partial<PlayerState>, propagateEvent: boolean = true): PlayerState {
    if (!PlayerStateService.playerState) {
      throw new PlayerStateNotInitializedError();
    }

    PlayerStateService.playerState = {
      ...structuredClone(PlayerStateService.playerState),
      ...newPlayerState,
    };

    if (propagateEvent) {
      PlayerStateService.debouncedSendLocalPlayerStateUpdateEvent();
    }

    return PlayerStateService.playerState;
  }

  private static debouncedSendLocalPlayerStateUpdateEvent(): void {
    if (PlayerStateService.debounceTimeout) {
      clearTimeout(PlayerStateService.debounceTimeout);
    }

    PlayerStateService.debounceTimeout = setTimeout(() => {
      PlayerStateService.sendLocalPlayerStateUpdateEvent();
      PlayerStateService.debounceTimeout = null;
    }, 50);
  }

  private static sendLocalPlayerStateUpdateEvent(): void {
    const id = LocalEventTypes.LocalPlayerStateUpdate;
    const eventData: LocalPlayerStateUpdateEvent = { id, state: PlayerStateService.playerState };

    EventStreamClient.broadcast<LocalPlayerStateUpdateEvent>(id, eventData);
  }
}

export class PlayerStateNotInitializedError extends Error {
  constructor() {
    super('PlayerStateService is not initialized');

    Object.setPrototypeOf(this, PlayerStateNotInitializedError.prototype);
  }
}

export { PlayerStateService };
