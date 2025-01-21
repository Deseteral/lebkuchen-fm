import { UserPreferencesService } from './user-preferences-service';
import { EventStreamClient } from './event-stream-client';
import { PlayXSoundEvent } from '../types/event-data';
import { playAudioFromUrl } from './audio-service';

abstract class PlayXSoundEventHandler {
  static initialize() {
    EventStreamClient.subscribe<PlayXSoundEvent>(
      'PlayXSoundEvent',
      PlayXSoundEventHandler.playXSoundEventHandler,
    );
  }

  static cleanup() {
    EventStreamClient.unsubscribe<PlayXSoundEvent>(
      'PlayXSoundEvent',
      PlayXSoundEventHandler.playXSoundEventHandler,
    );
  }

  private static playXSoundEventHandler(event: PlayXSoundEvent) {
    const shouldPlay = UserPreferencesService.get<boolean>('xSoundShouldPlay');
    if (!shouldPlay) {
      return;
    }

    const { soundUrl } = event;
    const volume = UserPreferencesService.get<number>('xSoundVolume');
    playAudioFromUrl(soundUrl, volume);
  }
}

export { PlayXSoundEventHandler };
