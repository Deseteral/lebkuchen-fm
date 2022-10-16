import { Song } from '@service/domain/songs/song';
import { Service } from 'typedi';
import { HistoryRepository } from '@service/domain/history/history-repository';
import { HistoryEntry } from '@service/domain/history/history-entry';
import { User } from '@service/domain/users/user';
import { HistorySummary } from '@service/domain/history/history-summary';
import { SongsService } from '@service/domain/songs/songs-service';

@Service()
class HistoryService {
  constructor(private repository: HistoryRepository, private songsService: SongsService) { }

  async getAll(): Promise<HistoryEntry[]> {
    return this.repository.findAllOrderByDateDesc();
  }

  async markAsPlayed(song: Song, user: User): Promise<void> {
    const entry: HistoryEntry = {
      date: new Date(),
      youtubeId: song.youtubeId,
      user: user.data.name,
    };

    this.repository.insert(entry);
  }

  async generateSummary(): Promise<HistorySummary> {
    const history = await this.repository.findAllOrderByDateDesc();
    const songs = await this.songsService.getAll();

    const mostPopularSongs = history
      .map((e) => e.youtubeId)
      .countOccurrences()
      .sort(([_, av], [__, bv]) => (bv - av));

    return {
      mostPopularSongs,
    };
  }
}

export { HistoryService };
