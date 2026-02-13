import type { Song } from '../../../types/player-state';
import { EventStreamClient } from '../../../services/event-stream-client';
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
import { PlayerStateNotInitializedError, PlayerStateService } from './player-state-service';
import { SocketConnectionClient } from '../../../services/socket-connection-client';

const AVAILABLE_PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

class NativePlayerService {
  private static videoElement: HTMLVideoElement | null = null;
  private static timeStateUpdateQueue: number | null = null;

  // prettier-ignore
  static initialize(videoElement: HTMLVideoElement): void {
    if (!videoElement) {
      console.log('[NativePlayerService] initialize called without video element');
      return;
    }

    NativePlayerService.videoElement = videoElement;
    NativePlayerService.subscribeToSocketEvents();
    NativePlayerService.sendPlayerStateRequest();

    NativePlayerService.videoElement.volume = 1;

    NativePlayerService.videoElement.addEventListener('playing', NativePlayerService.onPlaying);
    NativePlayerService.videoElement.addEventListener('timeupdate', NativePlayerService.onTimeUpdate);
    NativePlayerService.videoElement.addEventListener('ended', NativePlayerService.playNextSong);
    NativePlayerService.videoElement.addEventListener('error', NativePlayerService.playNextSong);
  }

  // prettier-ignore
  static cleanup(): void {
    PlayerStateService.reset();
    NativePlayerService.unsubscribeFromSocketEvents();
    if (!NativePlayerService.videoElement) {
      console.log('[NativePlayerService] cleanup called without video element');
      return;
    }

    NativePlayerService.videoElement.removeEventListener('playing', NativePlayerService.onPlaying);
    NativePlayerService.videoElement.removeEventListener('ended', NativePlayerService.playNextSong);
    NativePlayerService.videoElement.removeEventListener('error', NativePlayerService.playNextSong);
    NativePlayerService.videoElement.removeEventListener('timeupdate', NativePlayerService.onTimeUpdate);

    NativePlayerService.videoElement.pause();
    NativePlayerService.videoElement.removeAttribute('src');
    NativePlayerService.videoElement.load();
    NativePlayerService.videoElement = null;
  }

  // Video element event handlers
  private static onPlaying = (): void => {
    if (NativePlayerService.timeStateUpdateQueue !== null) {
      NativePlayerService.videoElement!.currentTime = NativePlayerService.timeStateUpdateQueue;
      NativePlayerService.timeStateUpdateQueue = null;
    }
  };

  private static onTimeUpdate = (): void => {
    const video = NativePlayerService.videoElement;
    if (!video) return;

    const seconds = video.currentTime;
    const { currentlyPlaying } = PlayerStateService.get() ?? {};
    if (seconds > 0 && currentlyPlaying) {
      PlayerStateService.change(
        {
          currentlyPlaying: {
            ...currentlyPlaying,
            time: seconds,
          },
        },
        false,
      );
    }
  };

  private static sendPlayerStateRequest(): void {
    SocketConnectionClient.sendSocketMessage<PlayerStateRequestEvent>({
      id: 'PlayerStateRequestEvent',
    });
  }

  // Socket event handlers
  private static playerStateUpdateEventHandler(eventData: PlayerStateUpdateEvent): void {
    const { state } = eventData;

    try {
      PlayerStateService.change({
        queue: state.queue,
        volume: state.volume,
      });
    } catch {
      PlayerStateService.initialize(state);
    }

    if (NativePlayerService.videoElement) {
      NativePlayerService.videoElement.volume = state.volume / 100;
    }

    if (state.currentlyPlaying) {
      const { song, time } = state.currentlyPlaying;
      NativePlayerService.playSong(song, time);
      NativePlayerService.timeStateUpdateQueue = time;
    }
  }

  private static addSongsToQueueEventHandler(eventData: AddSongsToQueueEvent): void {
    const { songs } = eventData;
    const playerState = PlayerStateService.get();
    const prevLength = playerState.queue.length;

    PlayerStateService.change({
      queue: [...playerState.queue, ...songs],
    });

    if (prevLength === 0 && songs.length > 0) {
      const video = NativePlayerService.videoElement;
      const isReadyToPlayNextVideo = !video || video.paused || video.ended;

      if (isReadyToPlayNextVideo) {
        NativePlayerService.playNextSong();
      }
    }
  }

  private static playerStateRequestEventHandler(event: PlayerStateRequestDonationEvent): void {
    try {
      const playerState = PlayerStateService.get();

      console.log('Local PlayerState requested:', playerState);
      SocketConnectionClient.sendSocketMessage<PlayerStateDonationEvent>({
        id: 'PlayerStateDonationEvent',
        requestHandle: event.requestHandle,
        state: playerState,
      });
    } catch (error) {
      if (error instanceof PlayerStateNotInitializedError) {
        console.log('Local PlayerState requested but not initialized');
      }
    }
  }

  private static skipEventHandler(eventData: SkipEvent): void {
    const { skipAll, amount } = eventData;
    const amountToSkip = skipAll ? Infinity : amount - 1;
    const { queue } = PlayerStateService.get();

    PlayerStateService.change({
      queue: queue.slice(amountToSkip),
    });
    NativePlayerService.playNextSong();
  }

  private static pauseEventHandler(): void {
    NativePlayerService.videoElement?.pause();
    PlayerStateService.change({ isPlaying: false });
  }

  private static resumeEventHandler(): void {
    if (!NativePlayerService.videoElement) {
      return;
    }

    NativePlayerService.videoElement.play();
    PlayerStateService.change({ isPlaying: true });
  }

  private static changeSpeedEventHandler(eventData: ChangeSpeedEvent): void {
    if (!NativePlayerService.videoElement) {
      return;
    }

    const { nextSpeed } = eventData;

    switch (nextSpeed) {
      case 0:
        NativePlayerService.videoElement.playbackRate = 1;
        break;
      case 1:
      case -1: {
        const current = NativePlayerService.videoElement.playbackRate;
        const indexOfCurrent = AVAILABLE_PLAYBACK_RATES.indexOf(current);

        if (indexOfCurrent === -1) break;

        const newSpeed = AVAILABLE_PLAYBACK_RATES[indexOfCurrent + nextSpeed];
        if (newSpeed !== undefined) {
          NativePlayerService.videoElement.playbackRate = newSpeed;
        }
        break;
      }
      default:
        break;
    }
  }

  private static changeVolumeEventHandler(eventData: ChangeVolumeEvent): void {
    if (!NativePlayerService.videoElement) {
      return;
    }

    const { isRelative, nextVolume } = eventData;
    const { volume } = PlayerStateService.get();

    if (isRelative) {
      const newVolume = Math.max(0, Math.min(100, volume + nextVolume));

      PlayerStateService.change({ volume: newVolume });
      NativePlayerService.videoElement.volume = newVolume / 100;
    } else {
      PlayerStateService.change({ volume: nextVolume });
      NativePlayerService.videoElement.volume = nextVolume / 100;
    }
  }

  private static replaceQueueEventHandler(eventData: ReplaceQueueEvent): void {
    const { songs } = eventData;
    PlayerStateService.change({ queue: songs });
  }

  private static rewindEventHandler(eventData: RewindEvent): void {
    const { modifier, time } = eventData;

    if (modifier) {
      NativePlayerService.rewindBy(time * modifier);
    } else {
      NativePlayerService.rewindTo(time);
    }
  }

  // Player methods
  private static playSong(song: Song | null, time: number = 0): void {
    const video = NativePlayerService.videoElement;
    if (!video) {
      return;
    }

    const { isPlaying } = PlayerStateService.get();

    if (song?.stream?.url) {
      PlayerStateService.change({
        currentlyPlaying: { song, time },
      });

      if (time === 0) {
        SocketConnectionClient.sendSocketMessage<SongChangedEvent>({ id: 'SongChanged', song });
      }

      video.src = song.stream.url;
      video.load();
      video.play().catch(() => {
        console.log('[NativePlayerService] playSong — Playback failed', song);
      });

      if (!isPlaying) {
        video.pause();
      }
    } else {
      console.log('[NativePlayerService] playSong — no song, stopping');
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  }

  private static playNextSong(): void {
    const playerState = PlayerStateService.get();
    const nextSong = playerState.queue.shift() || null;
    PlayerStateService.change({ queue: playerState.queue });

    NativePlayerService.playSong(nextSong);
  }

  private static rewindTo(time: number): void {
    if (!NativePlayerService.videoElement) {
      return;
    }

    const { currentlyPlaying } = PlayerStateService.get();
    if (!currentlyPlaying) {
      return;
    }

    NativePlayerService.videoElement.currentTime = time;
    PlayerStateService.change({
      currentlyPlaying: {
        ...currentlyPlaying,
        time,
      },
    });
  }

  private static rewindBy(time: number): void {
    const { currentlyPlaying } = PlayerStateService.get();
    if (!currentlyPlaying) {
      return;
    }

    const actualTime = currentlyPlaying.time;
    if (actualTime === undefined) {
      return;
    }

    const timeAfterRewind = Math.ceil(actualTime + time);
    if (timeAfterRewind < 0) {
      NativePlayerService.rewindTo(0);
    } else {
      NativePlayerService.rewindTo(timeAfterRewind);
    }
  }

  // prettier-ignore
  private static subscribeToSocketEvents(): void {
    EventStreamClient.subscribe<PlayerStateUpdateEvent>('PlayerStateUpdateEvent', NativePlayerService.playerStateUpdateEventHandler);
    EventStreamClient.subscribe<PlayerStateRequestDonationEvent>('PlayerStateRequestDonationEvent', NativePlayerService.playerStateRequestEventHandler);
    EventStreamClient.subscribe<AddSongsToQueueEvent>('AddSongsToQueueEvent', NativePlayerService.addSongsToQueueEventHandler);
    EventStreamClient.subscribe<PlayerPauseEvent>('PauseEvent', NativePlayerService.pauseEventHandler);
    EventStreamClient.subscribe<PlayerResumeEvent>('ResumeEvent', NativePlayerService.resumeEventHandler);
    EventStreamClient.subscribe<SkipEvent>('SkipEvent', NativePlayerService.skipEventHandler);
    EventStreamClient.subscribe<ChangeSpeedEvent>('ChangeSpeedEvent', NativePlayerService.changeSpeedEventHandler);
    EventStreamClient.subscribe<ChangeVolumeEvent>('ChangeVolumeEvent', NativePlayerService.changeVolumeEventHandler);
    EventStreamClient.subscribe<ReplaceQueueEvent>('ReplaceQueueEvent', NativePlayerService.replaceQueueEventHandler);
    EventStreamClient.subscribe<RewindEvent>('RewindEvent', NativePlayerService.rewindEventHandler);
  }

  // prettier-ignore
  private static unsubscribeFromSocketEvents(): void {
    EventStreamClient.unsubscribe<PlayerStateUpdateEvent>('PlayerStateUpdateEvent', NativePlayerService.playerStateUpdateEventHandler);
    EventStreamClient.unsubscribe<PlayerStateRequestDonationEvent>('PlayerStateRequestDonationEvent', NativePlayerService.playerStateRequestEventHandler);
    EventStreamClient.unsubscribe<AddSongsToQueueEvent>('AddSongsToQueueEvent', NativePlayerService.addSongsToQueueEventHandler);
    EventStreamClient.unsubscribe<PlayerPauseEvent>('PauseEvent', NativePlayerService.pauseEventHandler);
    EventStreamClient.unsubscribe<PlayerResumeEvent>('ResumeEvent', NativePlayerService.resumeEventHandler);
    EventStreamClient.unsubscribe<SkipEvent>('SkipEvent', NativePlayerService.skipEventHandler);
    EventStreamClient.unsubscribe<ChangeSpeedEvent>('ChangeSpeedEvent', NativePlayerService.changeSpeedEventHandler);
    EventStreamClient.unsubscribe<ChangeVolumeEvent>('ChangeVolumeEvent', NativePlayerService.changeVolumeEventHandler);
    EventStreamClient.unsubscribe<ReplaceQueueEvent>('ReplaceQueueEvent', NativePlayerService.replaceQueueEventHandler);
    EventStreamClient.unsubscribe<RewindEvent>('RewindEvent', NativePlayerService.rewindEventHandler);
  }
}

export { NativePlayerService };
