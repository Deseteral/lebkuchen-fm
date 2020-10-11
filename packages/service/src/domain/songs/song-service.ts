import * as SongRepository from './song-repository';
import * as YouTubeDataClient from '../../youtube/youtube-data-client';
import Song from './song';

async function getByName(name: string): Promise<Song | null> {
  return SongRepository.findByName(name);
}

async function getAll(): Promise<Song[]> {
  return SongRepository.findAllOrderByTimesPlayedDesc();
}

async function createNewSong(
  youtubeId: string, songName?: string, timesPlayed = 0, trimStartSeconds?: number, trimEndSeconds?: number,
): Promise<Song> {
  const name = songName || (await YouTubeDataClient.fetchVideoTitleForId(youtubeId));

  const song: Song = {
    name,
    youtubeId,
    timesPlayed,
    trimStartSeconds: (trimStartSeconds || null),
    trimEndSeconds: (trimEndSeconds || null),
  };

  await SongRepository.insert(song);
  return song;
}

async function incrementPlayCount(youtubeId: string, songName?: string): Promise<void> {
  const foundSong = await SongRepository.findByYoutubeId(youtubeId);

  if (foundSong) {
    const timesPlayed = (foundSong.timesPlayed + 1);
    await SongRepository.replace({ ...foundSong, timesPlayed });
  } else {
    await createNewSong(youtubeId, songName, 1);
  }
}

async function getSongByNameWithYouTubeIdFallback(songNameOrYouTubeId: string): Promise<Song> {
  const foundByNameSong = await SongRepository.findByName(songNameOrYouTubeId);
  if (foundByNameSong) return foundByNameSong;

  const youTubeId = songNameOrYouTubeId.split(' ')[0].trim();
  const foundByIdSong = await SongRepository.findByYoutubeId(youTubeId);
  if (foundByIdSong) return foundByIdSong;

  const song = await createNewSong(youTubeId);
  return song;
}

export {
  getAll,
  getByName,
  incrementPlayCount,
  getSongByNameWithYouTubeIdFallback,
  createNewSong,
};
