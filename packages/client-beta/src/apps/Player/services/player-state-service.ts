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
  private static playerState: PlayerState = {
    ...DEFAULT_PLAYER_STATE,
  };
  private static debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  static get(): PlayerState {
    return { ...PlayerStateService.playerState };
  }

  static change(newPlayerState: Partial<PlayerState>, propagateEvent: boolean = true): PlayerState {
    PlayerStateService.playerState = {
      ...PlayerStateService.playerState,
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
    const id = LocalEventTypes.LOCAL_PLAYER_STATE_UPDATE;
    const eventData: LocalPlayerStateUpdateEvent = { id, state: PlayerStateService.playerState };

    EventStreamClient.broadcast<LocalPlayerStateUpdateEvent>(id, { eventData });
  }
}

export { PlayerStateService };
