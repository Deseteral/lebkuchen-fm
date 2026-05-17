import { XSound } from '../../../types/x-sound';
import { apiFetchJson, apiFetchOrThrow } from '../../../services/api-fetch';

interface XSoundsResponse {
  sounds: XSound[];
}

interface XSoundTagsResponse {
  tags: string[];
}

export abstract class SoundboardService {
  static async playXSound(soundName: string) {
    const url = `/api/soundboard/play?soundName=${encodeURIComponent(soundName)}`;
    return apiFetchOrThrow(url, { method: 'POST' }).catch((err) =>
      console.error('[SoundboardService] Failed to play x-sound.', err),
    );
  }

  static async getXSounds() {
    const data = await apiFetchJson<XSoundsResponse>('/api/x-sounds');
    return data.sounds;
  }

  static async getXSoundsTags() {
    const data = await apiFetchJson<XSoundTagsResponse>('/api/x-sounds/tags');
    return data.tags;
  }

  static soundMatchesPhrase(sound: XSound, phrase: string) {
    const { name, tags = [] } = sound;
    const tagsAndNameJoinedString = [name, ...tags].join(' ').toLowerCase();
    return phrase
      .toLowerCase()
      .split(' ')
      .every((keyword) => tagsAndNameJoinedString.includes(keyword));
  }

  static soundsComparator(phrase: string) {
    return function compare(a: XSound, b: XSound) {
      const isGoodMatchA = a.name.startsWith(phrase);
      const isGoodMatchB = b.name.startsWith(phrase);

      if (isGoodMatchA !== isGoodMatchB) {
        return isGoodMatchA ? -1 : 1;
      }

      return (
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) ||
        b.timesPlayed - a.timesPlayed
      );
    };
  }
}
