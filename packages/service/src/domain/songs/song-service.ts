import SongRepository from './song-repository';
import * as YouTubeDataClient from '../../youtube/youtube-data-client';
import Song from './song';

class SongService {
  private repository: SongRepository;

  private constructor() {
    this.repository = SongRepository.instance;
  }

  async getByName(name: string): Promise<Song | null> {
    return this.repository.findByName(name);
  }

  async getAll(): Promise<Song[]> {
    return this.repository.findAllOrderByTimesPlayedDesc();
  }

  async createNewSong(
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

  static readonly instance = new SongService();
}

export default SongService;
