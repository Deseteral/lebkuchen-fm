import { XSound } from '../../../types/x-sound';

export abstract class SoundboardService {
  static async playXSound(soundName: string) {
    const url = `/api/soundboard/play?soundName=${encodeURIComponent(soundName)}`;
    return fetch(url, { method: 'POST' }).catch((err) => console.error(err));
  }

  static async getXSounds() {
    return fetch('/api/x-sounds')
      .then((res) => res.json())
      .then((res) => res.sounds);
  }

  static async getXSoundsTags() {
    return fetch('/api/x-sounds/tags')
      .then((res) => res.json())
      .then((res) => res.tags);
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
