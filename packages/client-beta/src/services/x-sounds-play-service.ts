import { UserPreferencesService } from './user-preferences-service';
import { EventStreamClient } from './event-stream-client';
import { PlayXSoundEvent } from '../types/event-data';

class XSoundsPlayService {
  static initialize() {
    EventStreamClient.subscribe<PlayXSoundEvent>(
      'PlayXSoundEvent',
      XSoundsPlayService.playXSoundEventHandler,
    );
  }

  static cleanup() {
    EventStreamClient.subscribe<PlayXSoundEvent>(
      'PlayXSoundEvent',
      XSoundsPlayService.playXSoundEventHandler,
    );
  }

  static play(soundUrl: string) {
    const audio = new Audio(soundUrl);
    const volume = (UserPreferencesService.get('xSoundVolume') ?? 50) as number;
    audio.volume = volume / 100;
    audio.play();
  }

  private static playXSoundEventHandler(event: PlayXSoundEvent) {
    const { soundUrl } = event;
    if (XSoundsPlayService.shouldPlay()) {
      XSoundsPlayService.play(soundUrl);
    }
  }

  private static shouldPlay() {
    return UserPreferencesService.get('xSoundPreference') ?? false;
  }
}

export { XSoundsPlayService };
