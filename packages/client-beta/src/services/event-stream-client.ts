import mitt, { type Handler } from 'mitt';
import { type LocalEvent } from '../types/local-events';

class EventStreamClient {
  private static emitter = mitt();

  static subscribe<T extends LocalEvent>(eventId: T['id'], callback: (event: T) => void): void {
    EventStreamClient.emitter.on(eventId, callback as Handler);
  }

  static unsubscribe<T extends LocalEvent>(eventId: T['id'], callback: (event: T) => void): void {
    EventStreamClient.emitter.off(eventId, callback as Handler);
  }

  static broadcast<T extends LocalEvent>(eventId: T['id'], eventData: T): void {
    EventStreamClient.emitter.emit(eventId, eventData);
  }
}

export { EventStreamClient };
