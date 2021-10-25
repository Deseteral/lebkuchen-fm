import Song from '@service/domain/songs/song';
import SongsRepository from '@service/domain/songs/songs-repository';
import YouTubeDataClient from '@service/youtube/youtube-data-client';
import { Service } from 'typedi';

@Service()
class SongsService {
  constructor(private repository: SongsRepository, private youTubeDataClient: YouTubeDataClient) { }

  async getByName(name: string): Promise<Song | null> {
    return this.repository.findByName(name);
  }

  async getAll(): Promise<Song[]> {
    return this.repository.findAllOrderByTimesPlayedDesc();
  }

  async createNewSong(
    youtubeId: string, songName?: string, timesPlayed = 0, trimStartSeconds?: number, trimEndSeconds?: number,
  ): Promise<Song> {
    const name = songName || (await this.youTubeDataClient.fetchVideoTitleForId(youtubeId));

    const song: Song = {
      name,
      youtubeId,
      timesPlayed,
      trimStartSeconds: (trimStartSeconds || null),
      trimEndSeconds: (trimEndSeconds || null),
    };

    await this.repository.insert(song);
    return song;
  }

  async incrementPlayCount(youtubeId: string, songName?: string): Promise<void> {
    const foundSong = await this.repository.findByYoutubeId(youtubeId);

    if (foundSong) {
      const timesPlayed = (foundSong.timesPlayed + 1);
      await this.repository.replace({ ...foundSong, timesPlayed });
    } else {
      await this.createNewSong(youtubeId, songName, 1);
    }
  }

  async getSongByNameWithYouTubeIdFallback(songNameOrYouTubeId: string): Promise<Song> {
    const foundByNameSong = await this.repository.findByName(songNameOrYouTubeId);
    if (foundByNameSong) return foundByNameSong;

    const youTubeId = songNameOrYouTubeId.split(' ')[0].trim();
    const foundByIdSong = await this.repository.findByYoutubeId(youTubeId);
    if (foundByIdSong) return foundByIdSong;

    const song = await this.createNewSong(youTubeId);
    return song;
  }

  async getSongsFromPlaylist(id: string): Promise<Song[]> {
    const videoIds = await this.youTubeDataClient.fetchYouTubeIdsForPlaylist(id);
    const songs: Promise<Song>[] = videoIds.map((videoId) => this.getSongByNameWithYouTubeIdFallback(videoId));
    return Promise.all(songs);
  }

  async filterEmbeddableSongs(songs: Song[]): Promise<Song[]> {
    const youtubeIds = songs.map((song) => song.youtubeId);
    const statuses = await this.youTubeDataClient.fetchVideosStatuses(youtubeIds);
    const idToEmbeddable: Map<string, boolean> = new Map(statuses.items.map((status) => [status.id, status.status.embeddable]));

    return songs.filter((song) => idToEmbeddable.get(song.youtubeId));
  }
}

export default SongsService;
