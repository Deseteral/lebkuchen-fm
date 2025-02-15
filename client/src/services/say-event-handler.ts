import { EventStreamClient } from './event-stream-client';
import { SayEvent } from '../types/event-data';
import { playAudioFromUrl } from './audio-service';

abstract class SayEventHandler {
  static initialize() {
    EventStreamClient.subscribe<SayEvent>(
      'SayEvent',
      SayEventHandler.sayEventHandler
    );
  }

  static cleanup() {
    EventStreamClient.unsubscribe<SayEvent>(
      'SayEvent',
      SayEventHandler.sayEventHandler
    );
  }

  private static sayEventHandler(event: SayEvent) {
    playAudioFromUrl(event.audio.src, 100);
  }
}

export { SayEventHandler };
