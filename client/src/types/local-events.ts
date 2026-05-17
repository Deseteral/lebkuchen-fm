import { EventData } from './event-data';

enum LocalEventTypes {
  LocalWebSocketConnectionReady = 'LocalWebSocketConnectionReady',
  LocalWebSocketConnectionLost = 'LocalWebSocketConnectionLost',
  LocalWebSocketConnectionRestored = 'LocalWebSocketConnectionRestored',
}

interface LocalWebSocketConnectionReadyEvent {
  id: LocalEventTypes.LocalWebSocketConnectionReady;
}

interface LocalWebSocketConnectionLostEvent {
  id: LocalEventTypes.LocalWebSocketConnectionLost;
}

interface LocalWebSocketConnectionRestoredEvent {
  id: LocalEventTypes.LocalWebSocketConnectionRestored;
}

type LocalEvent =
  | EventData
  | LocalWebSocketConnectionReadyEvent
  | LocalWebSocketConnectionLostEvent
  | LocalWebSocketConnectionRestoredEvent;

export {
  LocalEventTypes,
  type LocalEvent,
  type LocalWebSocketConnectionReadyEvent,
  type LocalWebSocketConnectionLostEvent,
  type LocalWebSocketConnectionRestoredEvent,
};
