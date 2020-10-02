import * as SongRepository from './song-repository';
import Song from './song';
import * as YouTubeDataService from '../youtube/youtube-data-service';

async function createNewSong(youtubeId: string, songTitle?: string): Promise<Song> {
  const name = songTitle || await YouTubeDataService.fetchVideoTitleForId(youtubeId);

  return {
    name,
    youtubeId,
    trimStartSeconds: null,
    trimEndSeconds: null,
    timesPlayed: 1,
  };
}

async function incrementPlayCount(youtubeId: string, songTitle?: string): Promise<void> {
  const foundSong = await SongRepository.findByYoutubeId(youtubeId);

  if (foundSong) {
    const timesPlayed = (foundSong.timesPlayed + 1);
    SongRepository.replace({ ...foundSong, timesPlayed });
  } else {
    const song = await createNewSong(youtubeId, songTitle);
    SongRepository.insert(song);
  }
}

export {
  incrementPlayCount,
};
