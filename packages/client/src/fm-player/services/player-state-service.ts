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
  emitter.emit('change', playerState);
  setTimeout(() => emitter.emit('playerStateReplaced'), 1000);
}

function popFromQueueFront(): (Song | null) {
  const popped = playerState.queue.shift();
  emitter.emit('change', playerState);
  return popped || null;
}

function addToQueue(songs: Song[]) {
  const prevLength = playerState.queue.length;
  playerState.queue.push(...songs);

  if (prevLength === 0 && playerState.queue.length > 0) {
    emitter.emit('songAddedToQueueFront');
  }
  emitter.emit('change', playerState);
}

function dropFromQueueFront(amount: number) {
  playerState.queue.splice(0, amount);
  emitter.emit('change', playerState);
}

function replaceQueue(songs: Song[]) {
  playerState.queue = songs;
  emitter.emit('change', playerState);
}

function changeVolume(nextVolume: number, isRelative: boolean) {
  if (isRelative) {
    playerState.volume += nextVolume;
  } else {
    playerState.volume = nextVolume;
  }
  YouTubePlayerService.setVolume(playerState.volume);
}

type PlayerStateEvent = void;
type PlayerStateEventType = (
  | 'songAddedToQueueFront'
  | 'playerStateReplaced'
);

function on(eventType: PlayerStateEventType, callback: Handler<PlayerStateEvent>) {
  emitter.on<PlayerStateEvent>(eventType, callback);
}

function onStateChange(callback: Handler<PlayerState>) {
  emitter.on<PlayerState>('change', callback);
}

function done() {
  emitter.emit('change', playerState);
}

export {
  getState,
  setState,
  popFromQueueFront,
  dropFromQueueFront,
  replaceQueue,
  addToQueue,
  changeVolume,
  on,
  onStateChange,
  done,
};
