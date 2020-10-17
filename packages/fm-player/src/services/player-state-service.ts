import { makeDefaultPlayerState, PlayerState, Song } from 'lebkuchen-fm-service';
import mitt, { Emitter, Handler } from 'mitt';
import * as YouTubePlayerService from './youtube-player-service';

let playerState: PlayerState = makeDefaultPlayerState();
const emitter: Emitter = mitt();

function getState(): PlayerState {
  return playerState;
}

function setState(nextState: PlayerState): void {
  playerState = nextState;
  emitter.emit('playerStateReplaced');
}

function popFromQueueFront(): (Song | null) {
  const popped = playerState.queue.shift();
  return popped || null;
}

function addToQueue(song: Song, atTheBeginning: boolean) {
  if (atTheBeginning) {
    playerState.queue.unshift(song);
  } else {
    playerState.queue.push(song);
  }

  if (playerState.queue.length === 1) {
    emitter.emit('songAddedToQueueFront');
  }
}

function dropFromQueueFront(amount: number) {
  playerState.queue.splice(0, amount);
}

function changeVolume(nextVolume: number) {
  playerState.volume = nextVolume;
  YouTubePlayerService.setVolume(nextVolume);
}

type PlayerStateEvent = void;
type PlayerStateEventType = (
  | 'songAddedToQueueFront'
  | 'playerStateReplaced'
);

function on(eventType: PlayerStateEventType, callback: Handler<PlayerStateEvent>) {
  emitter.on<PlayerStateEvent>(eventType, callback);
}

export {
  getState,
  setState,
  popFromQueueFront,
  dropFromQueueFront,
  addToQueue,
  changeVolume,
  on,
};
