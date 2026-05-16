import { createSignal } from 'solid-js';
import { EventStreamClient } from './event-stream-client';
import { LocalEventTypes, LocalPlayerStateUpdateEvent } from '../types/local-events';
import { Song } from '../types/player-state';

const [currentlyPlayingSong, setCurrentlyPlayingSong] = createSignal<string | null>(null);
const [playingNextSong, setPlayingNextSong] = createSignal<string | null>(null);
const [songQueue, setSongQueue] = createSignal<Song[] | null>(null);
const [isPlaying, setIsPlaying] = createSignal(false);

const onPlayerStateUpdate = (event: LocalPlayerStateUpdateEvent) => {
  console.log('[PlayerDaemon] Player state update.', event.state);
  const newCurrentlyPlayingSong = event.state?.currentlyPlaying?.song?.name;
  const queue = event.state?.queue;
  const newPlayingNextSong = queue?.[0] ? queue[0].name : null;

  setSongQueue(queue || null);
  setIsPlaying(Boolean(event.state?.isPlaying));
  setCurrentlyPlayingSong(newCurrentlyPlayingSong || null);
  setPlayingNextSong(newPlayingNextSong || null);
};

function initialize() {
  EventStreamClient.subscribe<LocalPlayerStateUpdateEvent>(
    LocalEventTypes.LocalPlayerStateUpdate,
    onPlayerStateUpdate,
  );
}

function cleanup() {
  EventStreamClient.unsubscribe<LocalPlayerStateUpdateEvent>(
    LocalEventTypes.LocalPlayerStateUpdate,
    onPlayerStateUpdate,
  );
}

export const PlayerDaemon = {
  currentlyPlayingSong,
  playingNextSong,
  songQueue,
  isPlaying,
  initialize,
  cleanup,
};
