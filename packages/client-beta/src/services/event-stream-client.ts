import mitt, { type Handler } from 'mitt';
import { type LocalEventData, type LocalEvents } from '../types/local-events';

class EventStreamClient {
  private static emitter = mitt();

  static subscribe<T extends LocalEventData>(
    eventId: T['id'],
    callback: (event: LocalEvents<T>) => void,
  ): void {
    EventStreamClient.emitter.on(eventId, callback as Handler);
  }

  static unsubscribe<T extends LocalEventData>(
    eventId: T['id'],
    callback: (event: LocalEvents<T>) => void,
  ): void {
    EventStreamClient.emitter.off(eventId, callback as Handler);
  }

  static broadcast<T extends LocalEventData>(
    eventId: T['id'],
    eventData: LocalEvents<T>,
  ): void {
    EventStreamClient.emitter.emit(eventId, eventData);
  }
}

export { EventStreamClient };
