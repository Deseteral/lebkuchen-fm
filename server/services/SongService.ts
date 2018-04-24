import SongRepository from '../repositories/SongRepository';
import Song from '../domain/Song';
import YouTubeDataClient from '../clients/YouTubeDataClient';

function getUpdatedSong(song: Song) : Song {
  return Object.assign(
    {},
    song,
    { timesPlayed: (song.timesPlayed + 1) },
  );
}

async function fetchSongTitle(youtubeId: string) : Promise<string> {
  const videoDetails = await YouTubeDataClient.getVideoDetails(youtubeId);
  const title = videoDetails.items[0].snippet.title;
  return title;
}

async function createNewSong(youtubeId: string, songTitle?: string) {
  const name = songTitle
    ? songTitle
    : await fetchSongTitle(youtubeId);

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
    console.log(updatedSong);
    console.log('');
    console.log('');
    SongRepository.replace(updatedSong);
  } else {
    const song = await createNewSong(youtubeId, songTitle);
    SongRepository.insert(song);
  }
}

export default {
  bumpPlayCount,
};
