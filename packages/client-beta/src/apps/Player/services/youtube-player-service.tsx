import YouTubePlayer from 'yt-player';
import type { Song } from '../../../types/player-state';
import { EventStreamClientService } from '../../../services/event-stream-client-service';
import type {
  AddSongsToQueueEvent,
  ChangeSpeedEvent, ChangeVolumeEvent,
  PlayerStateUpdateEvent, ReplaceQueueEvent, RewindEvent,
  SkipEvent, SongChangedEvent
} from '@service/event-stream/model/events';
import { type LocalEvents } from '../../../types/local-events';
import { PlayerStateService } from './player-state-service';
import { SocketConnectionClient } from '../../../services/socket-connection-client-service';

let player: YouTubePlayer;

interface YTPlayerStateUpdateQueue {
  time: (number | null),
}

// Queued updates to the YouTube player state that can only be applied when the video is loaded and
// already playing. This is a workaround for YouTube player API lacking proper callback support for
// state changes.
const ytPlayerStateUpdateQueue: YTPlayerStateUpdateQueue = {
  time: null,
};

function playerStateUpdateEventHandler({ eventData }: LocalEvents): void {
  const state = (eventData as PlayerStateUpdateEvent).state || {};
  PlayerStateService.change({
    queue: state.queue,
    volume: state.volume,
  });

  player.setVolume(state.volume);
  player.setPlaybackQuality('highres');

  if (state.currentlyPlaying) {
    const { song, time } = state.currentlyPlaying;
    playSong(song, time);
    ytPlayerStateUpdateQueue.time = time;
  }
}

function addSongsToQueueEventHandler({ eventData }: LocalEvents): void {
  const songs = (eventData as AddSongsToQueueEvent).songs || [];
  const playerState = PlayerStateService.get();
  const prevLength = playerState.queue.length;

  PlayerStateService.change({
    queue: [...playerState.queue, ...songs],
  });

  if (prevLength === 0 && songs.length > 0) {
    const ytPlayerState = player.getState();
    const isReadyToPlayNextVideo = (ytPlayerState !== 'playing');

    if (isReadyToPlayNextVideo) {
      playNextSong();
    }
  }
}

function playerStateRequestEventHandler({ sendResponse }: LocalEvents): void {
  if (sendResponse) {
    const playerState = PlayerStateService.get();
    console.log('Local PlayerState requested:', playerState);
    sendResponse(playerState);
  }
}

function skipEventHandler({ eventData }: LocalEvents): void {
  const { skipAll, amount } = (eventData as SkipEvent);
  const amountToSkip = skipAll ? Infinity : (amount - 1);
  const { queue } = PlayerStateService.get();

  PlayerStateService.change({
    queue: queue.slice(amountToSkip),
  });
  playNextSong();
}

function pauseEventHandler() {
  console.log('pause event');
  player.pause();
  PlayerStateService.change({ isPlaying: false });
}

function resumeEventHandler() {
  player.play();
  PlayerStateService.change({ isPlaying: true });
}

function changeSpeedEventHandler({ eventData }: LocalEvents): void {
  const { nextSpeed } = eventData as ChangeSpeedEvent;

  switch (nextSpeed) {
    case 0:
      player.setPlaybackRate(1);
      break;
    case 1:
    case -1: {
      const availableSpeeds = player.getAvailablePlaybackRates();
      const current = player.getPlaybackRate();
      const indexOfCurrent = availableSpeeds.indexOf(current);

      const newSpeed = availableSpeeds[indexOfCurrent + nextSpeed];
      if (newSpeed !== undefined) {
        player.setPlaybackRate(newSpeed);
      }
      break;
    }
    default:
      break;
  }
}

function changeVolumeEventHandler({ eventData }: LocalEvents): void {
  const { isRelative, nextVolume } = eventData as ChangeVolumeEvent;
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
    player.setVolume(newVolume);
  }
}

function replaceQueueEventHandler({ eventData }: LocalEvents): void {
  const { songs } = eventData as ReplaceQueueEvent;
  PlayerStateService.change({ queue: songs });
}

function revindEventHandler({ eventData }: LocalEvents): void {
  const { modifier, time } = eventData as RewindEvent;

  if (modifier) {
    rewindBy(time * modifier);
  } else {
    rewindTo(time);
  }
}

// PLAYER METHODS
function playSong(song: Song | null, time: number = 0) {
  if (song) {
    PlayerStateService.change({
      currentlyPlaying: { song, time },
    });

    if (time === 0) {
      const id = 'SongChanged';
      SocketConnectionClient
        .sendSocketMessage<SongChangedEvent>(id, { id, song });
    }

    player.load(song.youtubeId, true);
  } else {
    player.stop();
  }
}

function playNextSong() {
  const playerState = PlayerStateService.get();
  const nextSong = playerState.queue.shift();
  PlayerStateService.change({ queue: playerState.queue });

  if (nextSong) {
    playSong(nextSong);
  }
}

function rewindTo(time: number) {
  const { currentlyPlaying } = PlayerStateService.get();

  if (!currentlyPlaying) {
    return;
  }

  player.seek(time);
  PlayerStateService.change({
    currentlyPlaying: {
      ...currentlyPlaying,
      time,
    },
  });
}

function rewindBy(time: number) {
  const { currentlyPlaying } = PlayerStateService.get();
  const actualTime = currentlyPlaying?.time;

  if (actualTime === undefined) {
    return;
  }

  const timeAfterRewind = Math.ceil(actualTime + time);
  if (timeAfterRewind < 0) {
    rewindTo(0);
  } else {
    rewindTo(timeAfterRewind);
  }
}

function initialize(playerRootElementId: string) {
  player = new YouTubePlayer(
    `#${playerRootElementId}`,
    { host: 'https://www.youtube-nocookie.com' },
  );
  player.setVolume(100);
  player.setPlaybackQuality('highres');

  player.on('playing', () => {
    if (ytPlayerStateUpdateQueue.time !== null) {
      player.seek(ytPlayerStateUpdateQueue.time);
      ytPlayerStateUpdateQueue.time = null;
    }
  });

  player.on('timeupdate', (seconds: number) => {
    const { currentlyPlaying } = PlayerStateService.get();
    if (seconds > 0 && currentlyPlaying) {
      PlayerStateService.change(
        {
          currentlyPlaying: {
            ...currentlyPlaying,
            time: seconds
          },
        },
        false,
      );
    }
  });

  player.on('ended', playNextSong);
  player.on('error', playNextSong);
  player.on('unplayable', playNextSong);

  // EventStreamClient.subscribe<PlayerStateUpdateEvent>('PlayerStateUpdateEvent', playerStateUpdateEventHandler);
  EventStreamClientService.subscribe('PlayerStateUpdateEvent', playerStateUpdateEventHandler);
  EventStreamClientService.subscribe('AddSongsToQueueEvent', addSongsToQueueEventHandler);
  EventStreamClientService.subscribe('PlayerStateRequestEvent', playerStateRequestEventHandler);
  EventStreamClientService.subscribe('PauseEvent', pauseEventHandler);
  EventStreamClientService.subscribe('ResumeEvent', resumeEventHandler);
  EventStreamClientService.subscribe('SkipEvent', skipEventHandler);
  EventStreamClientService.subscribe('ChangeSpeedEvent', changeSpeedEventHandler);
  EventStreamClientService.subscribe('ChangeVolumeEvent', changeVolumeEventHandler);
  EventStreamClientService.subscribe('ReplaceQueueEvent', replaceQueueEventHandler);
  EventStreamClientService.subscribe('RewindEvent', revindEventHandler);
}

function cleanup() {
  EventStreamClientService.unsubscribe('PlayerStateUpdateEvent', playerStateUpdateEventHandler);
  EventStreamClientService.unsubscribe('AddSongsToQueueEvent', addSongsToQueueEventHandler);
  EventStreamClientService.unsubscribe('PlayerStateRequestEvent', playerStateRequestEventHandler);
  EventStreamClientService.unsubscribe('PauseEvent', pauseEventHandler);
  EventStreamClientService.unsubscribe('ResumeEvent', resumeEventHandler);
  EventStreamClientService.unsubscribe('SkipEvent', skipEventHandler);
  EventStreamClientService.unsubscribe('ChangeSpeedEvent', changeSpeedEventHandler);
  EventStreamClientService.unsubscribe('ChangeVolumeEvent', changeVolumeEventHandler);
  EventStreamClientService.unsubscribe('ReplaceQueueEvent', replaceQueueEventHandler);
  EventStreamClientService.unsubscribe('RewindEvent', revindEventHandler);
}

export const YoutubePlayerService = {
  initialize,
  cleanup,
}
