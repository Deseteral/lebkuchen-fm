import YouTubePlayer from 'yt-player';
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

class YoutubePlayerService {
  private static player: YouTubePlayer;
  private static timeStateUpdateQueue: number | null = null;

  static initialize(playerRootElementId: string): void {
    YoutubePlayerService.subscribeToSocketEvents();
    YoutubePlayerService.sendPlayerStateRequest();

    YoutubePlayerService.player = new YouTubePlayer(`#${playerRootElementId}`, {
      host: 'https://www.youtube-nocookie.com',
    });
    YoutubePlayerService.player.setVolume(100);
    YoutubePlayerService.player.setPlaybackQuality('highres');

    YoutubePlayerService.player.on('playing', () => {
      if (YoutubePlayerService.timeStateUpdateQueue !== null) {
        YoutubePlayerService.player.seek(YoutubePlayerService.timeStateUpdateQueue);
        YoutubePlayerService.timeStateUpdateQueue = null;
      }
    });

    YoutubePlayerService.player.on('timeupdate', (seconds: number) => {
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
    });

    YoutubePlayerService.player.on('ended', YoutubePlayerService.playNextSong);
    YoutubePlayerService.player.on('error', YoutubePlayerService.playNextSong);
    YoutubePlayerService.player.on('unplayable', YoutubePlayerService.playNextSong);
  }

  static cleanup(): void {
    PlayerStateService.reset();
    YoutubePlayerService.player.destroy();

    YoutubePlayerService.unsubscribeFromSocketEvents();
  }

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

    YoutubePlayerService.player.setVolume(state.volume);
    YoutubePlayerService.player.setPlaybackQuality('highres');

    if (state.currentlyPlaying) {
      const { song, time } = state.currentlyPlaying;
      YoutubePlayerService.playSong(song, time);
      YoutubePlayerService.timeStateUpdateQueue = time;
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
      const ytPlayerState = YoutubePlayerService.player.getState();
      const isReadyToPlayNextVideo = ytPlayerState !== 'playing';

      if (isReadyToPlayNextVideo) {
        YoutubePlayerService.playNextSong();
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
    YoutubePlayerService.playNextSong();
  }

  private static pauseEventHandler() {
    YoutubePlayerService.player.pause();
    PlayerStateService.change({ isPlaying: false });
  }

  private static resumeEventHandler() {
    YoutubePlayerService.player.play();
    PlayerStateService.change({ isPlaying: true });
  }

  private static changeSpeedEventHandler(eventData: ChangeSpeedEvent): void {
    const { nextSpeed } = eventData;

    switch (nextSpeed) {
      case 0:
        YoutubePlayerService.player.setPlaybackRate(1);
        break;
      case 1:
      case -1: {
        const availableSpeeds = YoutubePlayerService.player.getAvailablePlaybackRates();
        const current = YoutubePlayerService.player.getPlaybackRate();
        const indexOfCurrent = availableSpeeds.indexOf(current);

        const newSpeed = availableSpeeds[indexOfCurrent + nextSpeed];
        if (newSpeed !== undefined) {
          YoutubePlayerService.player.setPlaybackRate(newSpeed);
        }
        break;
      }
      default:
        break;
    }
  }

  private static changeVolumeEventHandler(eventData: ChangeVolumeEvent): void {
    const { isRelative, nextVolume } = eventData;
    const { volume } = PlayerStateService.get();

    if (isRelative) {
      let newVolume = volume + nextVolume;
      if (newVolume < 0) {
        newVolume = 0;
      }

      if (newVolume > 100) {
        newVolume = 100;
      }

      PlayerStateService.change({ volume: newVolume });
      YoutubePlayerService.player.setVolume(newVolume);
    } else {
      PlayerStateService.change({ volume: nextVolume });
      YoutubePlayerService.player.setVolume(nextVolume);
    }
  }

  private static replaceQueueEventHandler(eventData: ReplaceQueueEvent): void {
    const { songs } = eventData;
    PlayerStateService.change({ queue: songs });
  }

  private static revindEventHandler(eventData: RewindEvent): void {
    const { modifier, time } = eventData;

    if (modifier) {
      YoutubePlayerService.rewindBy(time * modifier);
    } else {
      YoutubePlayerService.rewindTo(time);
    }
  }

  // Player methods
  private static playSong(song: Song | null, time: number = 0) {
    if (song) {
      PlayerStateService.change({
        currentlyPlaying: { song, time },
      });

      if (time === 0) {
        SocketConnectionClient.sendSocketMessage<SongChangedEvent>({ id: 'SongChanged', song });
      }

      YoutubePlayerService.player.load(song.youtubeId, true);
    } else {
      YoutubePlayerService.player.stop();
    }
  }

  private static playNextSong() {
    const playerState = PlayerStateService.get();
    const nextSong = playerState.queue.shift();
    PlayerStateService.change({ queue: playerState.queue });

    if (nextSong) {
      YoutubePlayerService.playSong(nextSong);
    }
  }

  private static rewindTo(time: number) {
    const { currentlyPlaying } = PlayerStateService.get();

    if (!currentlyPlaying) {
      return;
    }

    YoutubePlayerService.player.seek(time);
    PlayerStateService.change({
      currentlyPlaying: {
        ...currentlyPlaying,
        time,
      },
    });
  }

  private static rewindBy(time: number) {
    const { currentlyPlaying } = PlayerStateService.get();

    if (!currentlyPlaying) {
      return;
    }

    const actualTime = currentlyPlaying?.time;

    if (actualTime === undefined) {
      return;
    }

    const timeAfterRewind = Math.ceil(actualTime + time);
    if (timeAfterRewind < 0) {
      YoutubePlayerService.rewindTo(0);
    } else {
      YoutubePlayerService.rewindTo(timeAfterRewind);
    }
  }

  // prettier-ignore
  private static subscribeToSocketEvents(): void {
    EventStreamClient.subscribe<PlayerStateUpdateEvent>('PlayerStateUpdateEvent', YoutubePlayerService.playerStateUpdateEventHandler);
    EventStreamClient.subscribe<PlayerStateRequestDonationEvent>('PlayerStateRequestDonationEvent', YoutubePlayerService.playerStateRequestEventHandler);
    EventStreamClient.subscribe<AddSongsToQueueEvent>('AddSongsToQueueEvent', YoutubePlayerService.addSongsToQueueEventHandler);
    EventStreamClient.subscribe<PlayerPauseEvent>('PauseEvent', YoutubePlayerService.pauseEventHandler);
    EventStreamClient.subscribe<PlayerResumeEvent>('ResumeEvent', YoutubePlayerService.resumeEventHandler);
    EventStreamClient.subscribe<SkipEvent>('SkipEvent', YoutubePlayerService.skipEventHandler);
    EventStreamClient.subscribe<ChangeSpeedEvent>('ChangeSpeedEvent', YoutubePlayerService.changeSpeedEventHandler);
    EventStreamClient.subscribe<ChangeVolumeEvent>('ChangeVolumeEvent', YoutubePlayerService.changeVolumeEventHandler);
    EventStreamClient.subscribe<ReplaceQueueEvent>('ReplaceQueueEvent', YoutubePlayerService.replaceQueueEventHandler);
    EventStreamClient.subscribe<RewindEvent>('RewindEvent', YoutubePlayerService.revindEventHandler);
  }

  // prettier-ignore
  private static unsubscribeFromSocketEvents(): void {
    EventStreamClient.unsubscribe<PlayerStateUpdateEvent>('PlayerStateUpdateEvent', YoutubePlayerService.playerStateUpdateEventHandler);
    EventStreamClient.unsubscribe<PlayerStateRequestDonationEvent>('PlayerStateRequestDonationEvent', YoutubePlayerService.playerStateRequestEventHandler);
    EventStreamClient.unsubscribe<AddSongsToQueueEvent>('AddSongsToQueueEvent', YoutubePlayerService.addSongsToQueueEventHandler);
    EventStreamClient.unsubscribe<PlayerPauseEvent>('PauseEvent', YoutubePlayerService.pauseEventHandler);
    EventStreamClient.unsubscribe<PlayerResumeEvent>('ResumeEvent', YoutubePlayerService.resumeEventHandler);
    EventStreamClient.unsubscribe<SkipEvent>('SkipEvent', YoutubePlayerService.skipEventHandler);
    EventStreamClient.unsubscribe<ChangeSpeedEvent>('ChangeSpeedEvent', YoutubePlayerService.changeSpeedEventHandler);
    EventStreamClient.unsubscribe<ChangeVolumeEvent>('ChangeVolumeEvent', YoutubePlayerService.changeVolumeEventHandler);
    EventStreamClient.unsubscribe<ReplaceQueueEvent>('ReplaceQueueEvent', YoutubePlayerService.replaceQueueEventHandler);
    EventStreamClient.unsubscribe<RewindEvent>('RewindEvent', YoutubePlayerService.revindEventHandler);
  }
}

export { YoutubePlayerService };
