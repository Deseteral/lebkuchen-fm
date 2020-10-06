import * as XSoundsRepository from './x-sounds-repository';
import XSound from './x-sound';

function getAll(): Promise<XSound[]> {
  return XSoundsRepository.findAllOrderByNameAsc();
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

async function createNewSound(name: string, url: string): Promise<void> {
  const xSound = {
    name,
    url,
    timesPlayed: 0,
  };

  // TODO: What about error handling?
  await XSoundsRepository.insert(xSound);
}

export {
  getAll,
  getByName,
  incrementPlayCount,
  createNewSound,
};
