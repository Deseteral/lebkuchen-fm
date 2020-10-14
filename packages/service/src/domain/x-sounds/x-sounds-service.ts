import XSoundsRepository from './x-sounds-repository';
import XSound from './x-sound';

function getAll(): Promise<XSound[]> {
  return XSoundsRepository.instance.findAllOrderByNameAsc();
}

async function getByName(soundName: string): Promise<XSound> {
  const xSound = await XSoundsRepository.instance.findByName(soundName);

  if (!xSound) {
    throw new Error(`Nie ma takiego dźwięku: ${soundName}`);
  }

  return xSound;
}

async function incrementPlayCount(soundName: string): Promise<void> {
  const xSound = await XSoundsRepository.instance.findByName(soundName);

  if (xSound) {
    const updatedSound = {
      ...xSound,
      timesPlayed: (xSound.timesPlayed + 1),
    };

    await XSoundsRepository.instance.replace(updatedSound);
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

  await XSoundsRepository.instance.insert(xSound);
}

export {
  getAll,
  getByName,
  incrementPlayCount,
  createNewSound,
};
