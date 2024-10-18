import { XSound } from '@service/domain/x-sounds/x-sound';

export async function getXSounds() {
  return fetch('/api/x-sounds')
    .then((res) => res.json())
    .then((res) => res.sounds);
}

export async function getXSoundsTags() {
  return fetch('/api/x-sounds/tags')
    .then((res) => res.json())
    .then((res) => res.tags);
}

export function soundMatchesPhrase(sound: XSound, phrase: string) {
  const { name, tags = [] } = sound;
  const tagsAndNameJoinedString = [name, ...tags].join(' ').toLowerCase();
  return phrase
    .toLowerCase()
    .split(' ')
    .every((keyword) => tagsAndNameJoinedString.includes(keyword));
}

export function soundsSorting(phrase: string) {
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
