import XRepository from '../repositories/XRepository';

async function bumpPlayCount(soundName: string) {
  const sound = await XRepository.getByName(soundName);

  // TODO: We can remove `|| 0` check when all XSounds in our database
  //       populate with `timesPlayed` field
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
