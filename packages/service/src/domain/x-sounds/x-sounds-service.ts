import * as XSoundsRepository from './x-sounds-repository';
import XSound from './x-sound';

function getAll(): Promise<XSound[]> {
  return XSoundsRepository.findAll();
}

function getByName(soundName: string): Promise<XSound | null> {
  return XSoundsRepository.findByName(soundName);
}

async function incrementPlayCount(soundName: string): Promise<void> {
  const xSound = await XSoundsRepository.findByName(soundName);

  if (xSound) {
    const updatedSound = {
      ...xSound,
      timesPlayed: (xSound.timesPlayed + 1),
    };

    XSoundsRepository.replace(updatedSound);
  }
}

export {
  getAll,
  getByName,
  incrementPlayCount,
};
