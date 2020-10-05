import { makeDefaultPlayerState, PlayerState, Song } from 'lebkuchen-fm-service';
import mitt, { Emitter, Handler } from 'mitt';

let playerState: PlayerState = makeDefaultPlayerState();
const emitter: Emitter = mitt();

function getState(): PlayerState {
  return playerState;
}

function setState(nextState: PlayerState): void {
  playerState = nextState;
}

function popFromQueueFront(): (Song | null) {
  const popped = playerState.queue.shift();
  return popped || null;
}

function addToQueue(song: Song) {
  playerState.queue.push(song);
  if (playerState.queue.length === 1) {
    emitter.emit('songAddedToQueueFront');
  }
}

type PlayerStateEventType = 'songAddedToQueueFront';
type PlayerStateEvent = void;

function on(eventType: PlayerStateEventType, callback: Handler<PlayerStateEvent>) {
  emitter.on<PlayerStateEvent>(eventType, callback);
}

export {
  getState,
  setState,
  popFromQueueFront,
  addToQueue,
  on,
};
