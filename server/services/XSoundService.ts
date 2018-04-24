import XRepository from '../repositories/XRepository';

async function bumpPlayCount(soundName: string) {
  const sound = await XRepository.getByName(soundName);
  const updatedSound = Object.assign(
    {},
    sound,
    { timesPlayed: ((sound.timesPlayed || 0) + 1) },
  );

  XRepository.replace(updatedSound);
}

export default {
  bumpPlayCount,
};
