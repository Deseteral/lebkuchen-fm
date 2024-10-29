import mitt, { type Handler } from 'mitt';
import { type LocalEventData, type LocalEvents } from '../types/local-events';

class EventStreamClient {
  private static emitter = mitt();

  static subscribe<T extends LocalEvents>(eventId: T['eventData']['id'], callback: (event: T) => void): void;
  // static subscribe<T extends LocalEventData>(eventId: T['id'], callback: (eventData: T) => void): void;

  static subscribe(eventId: string, callback: (event: LocalEvents | LocalEventData) => void) {
    EventStreamClient.emitter.on(
      eventId,
      callback as Handler,
    );
  }

  static unsubscribe(eventId: string, callback: (eventData: LocalEvents) => void) {
    EventStreamClient.emitter.off(
      eventId,
      callback as Handler,
    );
  }
}



const emitter  = mitt();

function subscribe(eventId: string, callback: (eventData: LocalEvents) => void) {
  emitter.on(
    eventId,
    callback as Handler,
  );
}

function unsubscribe(eventId: string, callback: (eventData: LocalEvents) => void) {
  emitter.off(
    eventId,
    callback as Handler,
  );
}

function broadcast(eventId: string, eventData: LocalEvents) {
  emitter.emit(eventId, eventData);
}

export { EventStreamClient };
export const EventStreamClientService = {
  subscribe,
  unsubscribe,
  broadcast,
}
