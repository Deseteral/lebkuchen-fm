import { EventData } from './event-data';

enum LocalEventTypes {
  LocalWebSocketConnectionReady = 'LocalWebSocketConnectionReady',
}

interface LocalWebSocketConnectionReadyEvent {
  id: LocalEventTypes.LocalWebSocketConnectionReady;
}

type LocalEvent = EventData | LocalWebSocketConnectionReadyEvent;

export { LocalEventTypes, type LocalEvent, type LocalWebSocketConnectionReadyEvent };
