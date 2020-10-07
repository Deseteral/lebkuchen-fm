import * as XSoundsRepository from './x-sounds-repository';
import * as Logger from '../../infrastructure/logger';
import XSound from './x-sound';

function getAll(): Promise<XSound[]> {
  return XSoundsRepository.findAllOrderByNameAsc();
}

async function getByName(soundName: string): Promise<XSound> {
  const xSound = await XSoundsRepository.findByName(soundName);

  if (!xSound) {
    throw new Error(`Nie ma takiego dźwięku: ${soundName}`);
  }

  return xSound;
}

async function incrementPlayCount(soundName: string): Promise<void> {
  const xSound = await XSoundsRepository.findByName(soundName);

  if (xSound) {
    const updatedSound = {
      ...xSound,
      timesPlayed: (xSound.timesPlayed + 1),
    };

    try {
      XSoundsRepository.replace(updatedSound);
    } catch (e) {
      Logger.error('Could not increment XSound play count', 'x-sounds-service');
      throw new Error('Wystąpił problem z dostępem do bazy dźwięków');
    }
  }
}

async function createNewSound(name: string, url: string, timesPlayed = 0): Promise<void> {
  const foundSound = await getByName(name);
  if (foundSound !== null) {
    throw new Error(`Dźwięk o nazwie "${name}" już jest w bazie`);
  }

  const xSound: XSound = {
    name,
    url,
    timesPlayed,
  };

  try {
    await XSoundsRepository.insert(xSound);
  } catch (e) {
    Logger.error('Could not insert new XSound to repository', 'x-sound-service');
    throw new Error('Nie udało się dodać nowego dźwięku');
  }
}

export {
  getAll,
  getByName,
  incrementPlayCount,
  createNewSound,
};
