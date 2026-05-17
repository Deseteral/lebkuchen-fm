import { createSignal } from 'solid-js';
import type { PlayerState, Song } from '../../../types/player-state';
import { EventStreamClient } from '../../../services/event-stream-client';
import { SocketConnectionClient } from '../../../services/socket-connection-client';
import {
  LocalEventTypes,
  type LocalWebSocketConnectionReadyEvent,
} from '../../../types/local-events';
import type {
  AddSongsToQueueEvent,
  ChangeSpeedEvent,
  ChangeVolumeEvent,
  PlayerPauseEvent,
  PlayerResumeEvent,
  PlayerStateDonationEvent,
  PlayerStateRequestDonationEvent,
  PlayerStateRequestEvent,
  PlayerStateUpdateEvent,
  ReplaceQueueEvent,
  RewindEvent,
  SkipEvent,
  SongChangedEvent,
} from '../../../types/event-data';
import { YoutubePlayerController } from './youtube-player-controller';

// --- Signals (reactive state for UI) ---
const [currentlyPlayingSong, setCurrentlyPlayingSong] = createSignal<string | null>(null);
const [playingNextSong, setPlayingNextSong] = createSignal<string | null>(null);
const [songQueue, setSongQueue] = createSignal<Song[] | null>(null);
const [isPlaying, setIsPlaying] = createSignal(false);
const [volume, setVolume] = createSignal(50);

class PlayerStateService {
  private static playerState: PlayerState | null = null;
  private static timeStateUpdateQueue: number | null = null;
  private static playerElementId: string | null = null;
  private static isPlayerOpen = false;

  // --- Signals (public, read-only) ---
  static readonly currentlyPlayingSong = currentlyPlayingSong;
  static readonly playingNextSong = playingNextSong;
  static readonly songQueue = songQueue;
  static readonly isPlaying = isPlaying;
  static readonly volume = volume;

  // --- Lifecycle ---

  /** Called once from Desktop.tsx onMount */
  static initialize(): void {
    PlayerStateService.subscribeToSocketEvents();
    PlayerStateService.subscribeToReconnect();
  }

  /** Called once from Desktop.tsx onCleanup */
  static cleanup(): void {
    PlayerStateService.unsubscribeFromSocketEvents();
    PlayerStateService.unsubscribeFromReconnect();
    PlayerStateService.destroyPlayer();
    PlayerStateService.resetState();
  }

  /** Called from YouTubePlayer component onMount */
  static initializePlayer(elementId: string): void {
    PlayerStateService.playerElementId = elementId;
    PlayerStateService.isPlayerOpen = true;

    if (SocketConnectionClient.isReady()) {
      PlayerStateService.createPlayer();
    }
  }

  /** Called from YouTubePlayer component onCleanup */
  static destroyPlayer(): void {
    PlayerStateService.isPlayerOpen = false;
    YoutubePlayerController.destroy();
    PlayerStateService.playerElementId = null;
    PlayerStateService.resetState();
  }

  // --- Internal state management ---

  private static resetState(): void {
    PlayerStateService.playerState = null;
    PlayerStateService.timeStateUpdateQueue = null;
    PlayerStateService.propagateToSignals();
  }

  private static get(): PlayerState {
    if (!PlayerStateService.playerState) {
      throw new PlayerStateNotInitializedError();
    }
    return structuredClone(PlayerStateService.playerState);
  }

  private static change(newState: Partial<PlayerState>): void {
    if (!PlayerStateService.playerState) {
      throw new PlayerStateNotInitializedError();
    }
    PlayerStateService.playerState = {
      ...structuredClone(PlayerStateService.playerState),
      ...newState,
    };
    PlayerStateService.propagateToSignals();
  }

  private static initializeState(state: PlayerState): void {
    PlayerStateService.playerState = state;
    PlayerStateService.propagateToSignals();
  }

  private static propagateToSignals(): void {
    const state = PlayerStateService.playerState;
    const queue = state?.queue ?? null;

    setCurrentlyPlayingSong(state?.currentlyPlaying?.song?.name ?? null);
    setPlayingNextSong(queue?.[0]?.name ?? null);
    setSongQueue(queue);
    setIsPlaying(Boolean(state?.isPlaying));
    setVolume(state?.volume ?? 50);
  }

  // --- Player creation ---

  private static createPlayer(): void {
    if (!PlayerStateService.playerElementId) return;
    if (YoutubePlayerController.isInitialized()) return;

    console.log('[PlayerStateService] Creating YouTube player.');

    YoutubePlayerController.initialize(PlayerStateService.playerElementId, {
      onPlaying: PlayerStateService.onIframePlaying,
      onPaused: PlayerStateService.onIframePaused,
      onTimeUpdate: PlayerStateService.onIframeTimeUpdate,
      onEnded: PlayerStateService.playNextSong,
    });

    PlayerStateService.sendPlayerStateRequest();
  }

  // --- WebSocket reconnect ---

  private static onWebSocketReady = (): void => {
    console.log('[PlayerStateService] WebSocket connection ready.');
    if (PlayerStateService.playerElementId && !YoutubePlayerController.isInitialized()) {
      PlayerStateService.createPlayer();
    }
  };

  private static subscribeToReconnect(): void {
    EventStreamClient.subscribe<LocalWebSocketConnectionReadyEvent>(
      LocalEventTypes.LocalWebSocketConnectionReady,
      PlayerStateService.onWebSocketReady,
    );
  }

  private static unsubscribeFromReconnect(): void {
    EventStreamClient.unsubscribe<LocalWebSocketConnectionReadyEvent>(
      LocalEventTypes.LocalWebSocketConnectionReady,
      PlayerStateService.onWebSocketReady,
    );
  }

  // --- Iframe callbacks ---

  private static onIframePlaying = (): void => {
    if (PlayerStateService.playerState) {
      PlayerStateService.change({ isPlaying: true });
    }

    if (PlayerStateService.timeStateUpdateQueue !== null) {
      YoutubePlayerController.seek(PlayerStateService.timeStateUpdateQueue);
      PlayerStateService.timeStateUpdateQueue = null;
    }
  };

  private static onIframePaused = (): void => {
    if (!PlayerStateService.playerState) return;

    const duration = YoutubePlayerController.getDuration();
    const currentTime = YoutubePlayerController.getCurrentTime();

    // Ignore pause events triggered by video ending (not a real user pause)
    if (duration > 0 && duration - currentTime < 1) return;

    PlayerStateService.change({ isPlaying: false });
  };

  private static onIframeTimeUpdate = (seconds: number): void => {
    const currentlyPlaying = PlayerStateService.playerState?.currentlyPlaying;
    if (seconds > 0 && currentlyPlaying) {
      // Update time without propagating to signals (high-frequency event)
      PlayerStateService.playerState = {
        ...PlayerStateService.playerState!,
        currentlyPlaying: { ...currentlyPlaying, time: seconds },
      };
    }
  };

  // --- Player methods ---

  private static playSong(song: Song | null, time: number = 0): void {
    const isCurrentlyPlaying = PlayerStateService.playerState?.isPlaying ?? false;

    if (song) {
      PlayerStateService.change({ currentlyPlaying: { song, time } });

      if (time === 0) {
        SocketConnectionClient.sendSocketMessage<SongChangedEvent>({ id: 'SongChanged', song });
      }

      YoutubePlayerController.load(song.youtubeId);

      if (!isCurrentlyPlaying) {
        YoutubePlayerController.stop();
      }
    } else {
      YoutubePlayerController.stop();
    }
  }

  private static playNextSong = (): void => {
    const state = PlayerStateService.get();
    const nextSong = state.queue.shift() ?? null;
    PlayerStateService.change({ queue: state.queue });
    PlayerStateService.playSong(nextSong);
  };

  private static rewindTo(time: number): void {
    const { currentlyPlaying } = PlayerStateService.get();
    if (!currentlyPlaying) return;

    YoutubePlayerController.seek(time);
    PlayerStateService.change({ currentlyPlaying: { ...currentlyPlaying, time } });
  }

  private static rewindBy(time: number): void {
    const { currentlyPlaying } = PlayerStateService.get();
    if (!currentlyPlaying || currentlyPlaying.time === undefined) return;

    const timeAfterRewind = Math.ceil(currentlyPlaying.time + time);
    PlayerStateService.rewindTo(timeAfterRewind < 0 ? 0 : timeAfterRewind);
  }

  private static sendPlayerStateRequest(): void {
    SocketConnectionClient.sendSocketMessage<PlayerStateRequestEvent>({
      id: 'PlayerStateRequestEvent',
    });
  }

  // --- Socket event handlers ---

  private static playerStateUpdateEventHandler = (eventData: PlayerStateUpdateEvent): void => {
    if (!PlayerStateService.isPlayerOpen) return;

    const { state } = eventData;

    if (PlayerStateService.playerState) {
      PlayerStateService.change({
        queue: state.queue,
        volume: state.volume,
        isPlaying: state.isPlaying,
      });
    } else {
      PlayerStateService.initializeState(state);
    }

    YoutubePlayerController.setVolume(state.volume);
    YoutubePlayerController.setPlaybackQuality('highres');

    if (state.currentlyPlaying) {
      const { song, time } = state.currentlyPlaying;
      PlayerStateService.playSong(song, time);
      PlayerStateService.timeStateUpdateQueue = time;
    }
  };

  private static addSongsToQueueEventHandler = (eventData: AddSongsToQueueEvent): void => {
    if (!PlayerStateService.isPlayerOpen) return;

    const { songs } = eventData;
    const state = PlayerStateService.get();
    const prevLength = state.queue.length;

    PlayerStateService.change({ queue: [...state.queue, ...songs] });

    if (prevLength === 0 && songs.length > 0 && !state.currentlyPlaying) {
      PlayerStateService.playNextSong();
    }
  };

  private static playerStateRequestEventHandler = (
    event: PlayerStateRequestDonationEvent,
  ): void => {
    if (!PlayerStateService.isPlayerOpen) {
      console.log('[PlayerStateService] Player closed; skipping state donation.');
      return;
    }

    try {
      const state = PlayerStateService.get();
      console.log('[PlayerStateService] Local PlayerState requested.', state);
      SocketConnectionClient.sendSocketMessage<PlayerStateDonationEvent>({
        id: 'PlayerStateDonationEvent',
        requestHandle: event.requestHandle,
        state,
      });
    } catch (error) {
      if (error instanceof PlayerStateNotInitializedError) {
        console.log('[PlayerStateService] Local PlayerState requested but not initialized.');
      }
    }
  };

  private static skipEventHandler = (eventData: SkipEvent): void => {
    if (!PlayerStateService.isPlayerOpen) return;

    const { skipAll, amount } = eventData;
    const amountToSkip = skipAll ? Infinity : amount - 1;
    const { queue } = PlayerStateService.get();

    PlayerStateService.change({ queue: queue.slice(amountToSkip) });
    PlayerStateService.playNextSong();
  };

  private static pauseEventHandler = (): void => {
    if (!PlayerStateService.isPlayerOpen) return;

    YoutubePlayerController.pause();
    PlayerStateService.change({ isPlaying: false });
  };

  private static resumeEventHandler = (): void => {
    if (!PlayerStateService.isPlayerOpen) return;

    YoutubePlayerController.play();
    PlayerStateService.change({ isPlaying: true });
  };

  private static changeSpeedEventHandler = (eventData: ChangeSpeedEvent): void => {
    if (!PlayerStateService.isPlayerOpen) return;

    const { nextSpeed } = eventData;

    switch (nextSpeed) {
      case 0:
        YoutubePlayerController.setPlaybackRate(1);
        break;
      case 1:
      case -1: {
        const availableSpeeds = YoutubePlayerController.getAvailablePlaybackRates();
        const current = YoutubePlayerController.getPlaybackRate();
        const indexOfCurrent = availableSpeeds.indexOf(current);
        const newSpeed = availableSpeeds[indexOfCurrent + nextSpeed];
        if (newSpeed !== undefined) {
          YoutubePlayerController.setPlaybackRate(newSpeed);
        }
        break;
      }
      default:
        break;
    }
  };

  private static changeVolumeEventHandler = (eventData: ChangeVolumeEvent): void => {
    if (!PlayerStateService.isPlayerOpen) return;

    const { isRelative, nextVolume } = eventData;
    const { volume } = PlayerStateService.get();

    if (isRelative) {
      const newVolume = Math.max(0, Math.min(100, volume + nextVolume));
      PlayerStateService.change({ volume: newVolume });
      YoutubePlayerController.setVolume(newVolume);
    } else {
      PlayerStateService.change({ volume: nextVolume });
      YoutubePlayerController.setVolume(nextVolume);
    }
  };

  private static replaceQueueEventHandler = (eventData: ReplaceQueueEvent): void => {
    if (!PlayerStateService.isPlayerOpen) return;

    PlayerStateService.change({ queue: eventData.songs });
  };

  private static rewindEventHandler = (eventData: RewindEvent): void => {
    if (!PlayerStateService.isPlayerOpen) return;

    const { modifier, time } = eventData;
    if (modifier) {
      PlayerStateService.rewindBy(time * modifier);
    } else {
      PlayerStateService.rewindTo(time);
    }
  };

  // prettier-ignore
  private static subscribeToSocketEvents(): void {
    EventStreamClient.subscribe<PlayerStateUpdateEvent>('PlayerStateUpdateEvent', PlayerStateService.playerStateUpdateEventHandler);
    EventStreamClient.subscribe<PlayerStateRequestDonationEvent>('PlayerStateRequestDonationEvent', PlayerStateService.playerStateRequestEventHandler);
    EventStreamClient.subscribe<AddSongsToQueueEvent>('AddSongsToQueueEvent', PlayerStateService.addSongsToQueueEventHandler);
    EventStreamClient.subscribe<PlayerPauseEvent>('PauseEvent', PlayerStateService.pauseEventHandler);
    EventStreamClient.subscribe<PlayerResumeEvent>('ResumeEvent', PlayerStateService.resumeEventHandler);
    EventStreamClient.subscribe<SkipEvent>('SkipEvent', PlayerStateService.skipEventHandler);
    EventStreamClient.subscribe<ChangeSpeedEvent>('ChangeSpeedEvent', PlayerStateService.changeSpeedEventHandler);
    EventStreamClient.subscribe<ChangeVolumeEvent>('ChangeVolumeEvent', PlayerStateService.changeVolumeEventHandler);
    EventStreamClient.subscribe<ReplaceQueueEvent>('ReplaceQueueEvent', PlayerStateService.replaceQueueEventHandler);
    EventStreamClient.subscribe<RewindEvent>('RewindEvent', PlayerStateService.rewindEventHandler);
  }

  // prettier-ignore
  private static unsubscribeFromSocketEvents(): void {
    EventStreamClient.unsubscribe<PlayerStateUpdateEvent>('PlayerStateUpdateEvent', PlayerStateService.playerStateUpdateEventHandler);
    EventStreamClient.unsubscribe<PlayerStateRequestDonationEvent>('PlayerStateRequestDonationEvent', PlayerStateService.playerStateRequestEventHandler);
    EventStreamClient.unsubscribe<AddSongsToQueueEvent>('AddSongsToQueueEvent', PlayerStateService.addSongsToQueueEventHandler);
    EventStreamClient.unsubscribe<PlayerPauseEvent>('PauseEvent', PlayerStateService.pauseEventHandler);
    EventStreamClient.unsubscribe<PlayerResumeEvent>('ResumeEvent', PlayerStateService.resumeEventHandler);
    EventStreamClient.unsubscribe<SkipEvent>('SkipEvent', PlayerStateService.skipEventHandler);
    EventStreamClient.unsubscribe<ChangeSpeedEvent>('ChangeSpeedEvent', PlayerStateService.changeSpeedEventHandler);
    EventStreamClient.unsubscribe<ChangeVolumeEvent>('ChangeVolumeEvent', PlayerStateService.changeVolumeEventHandler);
    EventStreamClient.unsubscribe<ReplaceQueueEvent>('ReplaceQueueEvent', PlayerStateService.replaceQueueEventHandler);
    EventStreamClient.unsubscribe<RewindEvent>('RewindEvent', PlayerStateService.rewindEventHandler);
  }
}

export class PlayerStateNotInitializedError extends Error {
  constructor() {
    super('PlayerStateService is not initialized');
    Object.setPrototypeOf(this, PlayerStateNotInitializedError.prototype);
  }
}

export { PlayerStateService };
