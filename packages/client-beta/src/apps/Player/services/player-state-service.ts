import type { PlayerState } from '../../../types/player-state';
import { LocalEventTypes, type LocalPlayerStateUpdateEvent } from '../../../types/local-events';
import { EventStreamClient } from '../../../services/event-stream-client';

const DEFAULT_PLAYER_STATE: PlayerState = {
  currentlyPlaying: null,
  queue: [],
  isPlaying: true,
  volume: 100,
};

class PlayerStateService {
  // Null when Player is closed and there is no active subscription for WebSocket Player events
  private static playerState: PlayerState | null = null;
  private static debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  static reset(): void {
    PlayerStateService.playerState = null;
    PlayerStateService.debouncedSendLocalPlayerStateUpdateEvent();
  }

  static initialize(): void {
    PlayerStateService.playerState = DEFAULT_PLAYER_STATE;
    PlayerStateService.debouncedSendLocalPlayerStateUpdateEvent();
  }

  static get(): PlayerState | null {
    if (!PlayerStateService.playerState) {
      return null;
    }

    return { ...PlayerStateService.playerState };
  }

  static change(newPlayerState: Partial<PlayerState>, propagateEvent: boolean = true): PlayerState {
    PlayerStateService.playerState = {
      ...(PlayerStateService.playerState ?? DEFAULT_PLAYER_STATE),
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

export { PlayerStateService };
