import { EventStreamClient } from './event-stream-client';
import { NotificationService } from './notification-service';
import {
  AddSongsToQueueEvent,
  PlayXSoundEvent,
  PlayerPauseEvent,
  PlayerResumeEvent,
  SkipEvent,
} from '../types/event-data';
import {
  LocalEventTypes,
  type LocalWebSocketConnectionLostEvent,
  type LocalWebSocketConnectionRestoredEvent,
} from '../types/local-events';

const EVENT_IDS = {
  PlayXSound: 'PlayXSoundEvent',
  AddSongsToQueue: 'AddSongsToQueueEvent',
  Pause: 'PauseEvent',
  Resume: 'ResumeEvent',
  Skip: 'SkipEvent',
} as const;

const CONNECTION_LOST_TOAST_DELAY_MS = 2000;
const CONNECTION_LOST_TOAST_KEY = 'socket-connection-lost';
const CONNECTION_LOST_PANEL_COOLDOWN_MS = 30000;

let connectionLostSince: number | null = null;
let connectionLostToastTimer: ReturnType<typeof setTimeout> | null = null;
let lastConnectionLostPanelAt = 0;

function clearConnectionLostToastTimer() {
  if (connectionLostToastTimer) {
    clearTimeout(connectionLostToastTimer);
    connectionLostToastTimer = null;
  }
}

function displayName(actorName?: string | null): string {
  return actorName && actorName.trim().length > 0 ? actorName : 'Someone';
}

function soundLabel(event: PlayXSoundEvent): string {
  if ('soundName' in event && event.soundName) {
    return event.soundName;
  }
  return 'a sound';
}

function handlePlayXSound(event: PlayXSoundEvent) {
  const actor = displayName(event.actorName);
  NotificationService.addNotification('Sound played', `${actor} played ${soundLabel(event)}`);
}

function handleAddSongs(event: AddSongsToQueueEvent) {
  const actor = displayName(event.actorName);
  const songs = event.songs ?? [];
  const count = songs.length;
  const message =
    count === 1
      ? `${actor} queued ${songs[0]?.name ?? 'a song'}`
      : `${actor} queued ${count} songs`;

  NotificationService.addNotification('Song queued', message);
}

function handlePause(event: PlayerPauseEvent) {
  const actor = displayName(event.actorName);
  NotificationService.addNotification('Player paused', `${actor} paused the player`);
}

function handleResume(event: PlayerResumeEvent) {
  const actor = displayName(event.actorName);
  NotificationService.addNotification('Player resumed', `${actor} resumed the player`);
}

function handleSkip(event: SkipEvent) {
  const actor = displayName(event.actorName);
  let message = `${actor} skipped`;
  if (event.skipAll) {
    message = `${actor} skipped all songs`;
  } else if (event.amount > 1) {
    message = `${actor} skipped ${event.amount} songs`;
  }

  NotificationService.addNotification('Song skipped', message);
}

function handleWebSocketConnectionLost() {
  if (connectionLostSince !== null) return;

  connectionLostSince = Date.now();

  if (Date.now() - lastConnectionLostPanelAt > CONNECTION_LOST_PANEL_COOLDOWN_MS) {
    NotificationService.addNotification('Connection', 'Connection lost. Reconnecting...', {
      showToast: false,
    });
    lastConnectionLostPanelAt = Date.now();
  }

  clearConnectionLostToastTimer();
  connectionLostToastTimer = setTimeout(() => {
    if (connectionLostSince === null) return;

    NotificationService.upsertToastByKey('Connection', 'Connection lost. Reconnecting...', {
      key: CONNECTION_LOST_TOAST_KEY,
      sticky: true,
      showInPanel: false,
    });
  }, CONNECTION_LOST_TOAST_DELAY_MS);
}

function handleWebSocketConnectionRestored() {
  if (connectionLostSince === null) return;

  clearConnectionLostToastTimer();

  NotificationService.dismissToastByKey(CONNECTION_LOST_TOAST_KEY);

  NotificationService.addNotification('Connection', 'Connection restored.');
  connectionLostSince = null;
}

function initialize() {
  EventStreamClient.subscribe<PlayXSoundEvent>(EVENT_IDS.PlayXSound, handlePlayXSound);
  EventStreamClient.subscribe<AddSongsToQueueEvent>(EVENT_IDS.AddSongsToQueue, handleAddSongs);
  EventStreamClient.subscribe<PlayerPauseEvent>(EVENT_IDS.Pause, handlePause);
  EventStreamClient.subscribe<PlayerResumeEvent>(EVENT_IDS.Resume, handleResume);
  EventStreamClient.subscribe<SkipEvent>(EVENT_IDS.Skip, handleSkip);
  EventStreamClient.subscribe<LocalWebSocketConnectionLostEvent>(
    LocalEventTypes.LocalWebSocketConnectionLost,
    handleWebSocketConnectionLost,
  );
  EventStreamClient.subscribe<LocalWebSocketConnectionRestoredEvent>(
    LocalEventTypes.LocalWebSocketConnectionRestored,
    handleWebSocketConnectionRestored,
  );
}

function cleanup() {
  EventStreamClient.unsubscribe<PlayXSoundEvent>(EVENT_IDS.PlayXSound, handlePlayXSound);
  EventStreamClient.unsubscribe<AddSongsToQueueEvent>(EVENT_IDS.AddSongsToQueue, handleAddSongs);
  EventStreamClient.unsubscribe<PlayerPauseEvent>(EVENT_IDS.Pause, handlePause);
  EventStreamClient.unsubscribe<PlayerResumeEvent>(EVENT_IDS.Resume, handleResume);
  EventStreamClient.unsubscribe<SkipEvent>(EVENT_IDS.Skip, handleSkip);
  EventStreamClient.unsubscribe<LocalWebSocketConnectionLostEvent>(
    LocalEventTypes.LocalWebSocketConnectionLost,
    handleWebSocketConnectionLost,
  );
  EventStreamClient.unsubscribe<LocalWebSocketConnectionRestoredEvent>(
    LocalEventTypes.LocalWebSocketConnectionRestored,
    handleWebSocketConnectionRestored,
  );

  clearConnectionLostToastTimer();
  NotificationService.dismissToastByKey(CONNECTION_LOST_TOAST_KEY);
  connectionLostSince = null;
}

const NotificationDaemon = {
  initialize,
  cleanup,
};

export { NotificationDaemon };
