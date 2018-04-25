import SongRepository from '../repositories/SongRepository';
import Song from '../domain/Song';
import FetchVideoTitle from '../helpers/FetchVideoTitle';

function getUpdatedSong(song: Song) : Song {
  return Object.assign(
    {},
    song,
    { timesPlayed: (song.timesPlayed + 1) },
  );
}

async function createNewSong(youtubeId: string, songTitle?: string) {
  const name = songTitle
    ? songTitle
    : await FetchVideoTitle.fetch(youtubeId);

  const song: Song = {
    name,
    youtubeId,
    trimStartSeconds: null,
    trimEndSeconds: null,
    timesPlayed: 1,
  };

  return song;
}

async function bumpPlayCount(youtubeId: string, songTitle?: string) {
  const foundSong = await SongRepository.getByYoutubeId(youtubeId);

  if (foundSong) {
    const updatedSong: Song = getUpdatedSong(foundSong);
    SongRepository.replace(updatedSong);
  } else {
    const song = await createNewSong(youtubeId, songTitle);
    SongRepository.insert(song);
  }
}

export default {
  bumpPlayCount,
};
