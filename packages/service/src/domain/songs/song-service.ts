import * as SongRepository from './song-repository';
import * as YouTubeDataClient from '../../youtube/youtube-data-client';
import Song from './song';

async function createNewSong(
  youtubeId: string, songTitle?: string, timesPlayed = 0, trimStartSeconds?: number, trimEndSeconds?: number,
): Promise<void> {
  const name = songTitle || (await YouTubeDataClient.fetchVideoTitleForId(youtubeId));

  const song: Song = {
    name,
    youtubeId,
    timesPlayed,
    trimStartSeconds: trimStartSeconds || null,
    trimEndSeconds: trimEndSeconds || null,
  };

  await SongRepository.insert(song);
}

async function incrementPlayCount(youtubeId: string, songTitle?: string): Promise<void> {
  const foundSong = await SongRepository.findByYoutubeId(youtubeId);

  if (foundSong) {
    const timesPlayed = (foundSong.timesPlayed + 1);
    await SongRepository.replace({ ...foundSong, timesPlayed });
  } else {
    await createNewSong(youtubeId, songTitle, 1);
  }
}

async function getSongByNameWithYouTubeIdFallback(songNameOrYouTubeId: string): Promise<Song> {
  const foundSong = await SongRepository.findByName(songNameOrYouTubeId);
  if (foundSong) return foundSong;

  const youTubeId = songNameOrYouTubeId.split(' ')[0].trim();
  await createNewSong(youTubeId);
  return getSongByNameWithYouTubeIdFallback(songNameOrYouTubeId);
}

export {
  incrementPlayCount,
  getSongByNameWithYouTubeIdFallback,
};
