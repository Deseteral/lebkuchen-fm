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

function addToQueue(songs: Song[], atTheBeginning: boolean) {
  const prevLength = playerState.queue.length;

  if (atTheBeginning) {
    playerState.queue.unshift(...songs);
  } else {
    playerState.queue.push(...songs);
  }

  if (prevLength === 0 && playerState.queue.length > 0) {
    emitter.emit('songAddedToQueueFront');
  }
}

function dropFromQueueFront(amount: number) {
  playerState.queue.splice(0, amount);
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

export {
  getState,
  setState,
  popFromQueueFront,
  dropFromQueueFront,
  addToQueue,
  changeVolume,
  on,
};
