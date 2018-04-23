import SongRepository from '../repositories/SongRepository';
import Song from '../domain/Song';

async function bumpPlayCount(youtubeId: string) {
  const song = await SongRepository.getByYoutubeId(youtubeId);

  const updatedSong: Song = Object.assign(
    {},
    song,
    { timesPlayed: (song.timesPlayed + 1) },
  );

  SongRepository.update(updatedSong);
}

export default {
  bumpPlayCount,
};
