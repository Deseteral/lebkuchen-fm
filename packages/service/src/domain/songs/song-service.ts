import * as SongRepository from './song-repository';
import * as YouTubeDataClient from '../../youtube/youtube-data-client';
import Song from './song';

async function createNewSong(youtubeId: string, songTitle?: string): Promise<Song> {
  const name = songTitle || await YouTubeDataClient.fetchVideoTitleForId(youtubeId);

  return {
    name,
    youtubeId,
    trimStartSeconds: null,
    trimEndSeconds: null,
    timesPlayed: 0,
  };
}

async function incrementPlayCount(youtubeId: string, songTitle?: string): Promise<void> {
  const foundSong = await SongRepository.findByYoutubeId(youtubeId);

  if (foundSong) {
    const timesPlayed = (foundSong.timesPlayed + 1);
    SongRepository.replace({ ...foundSong, timesPlayed });
  } else {
    const song = await createNewSong(youtubeId, songTitle);
    song.timesPlayed = 1;
    SongRepository.insert(song);
  }
}

async function getSongByNameWithYouTubeIdFallback(songNameOrYouTubeId: string): Promise<Song> {
  const songFromStorage = await SongRepository.findByName(songNameOrYouTubeId);
  if (songFromStorage) return songFromStorage;

  const youTubeId = songNameOrYouTubeId.split(' ')[0].trim();
  return createNewSong(youTubeId);
}

export {
  incrementPlayCount,
  getSongByNameWithYouTubeIdFallback,
};
