import { Song } from '@service/domain/songs/song';
import { Service } from 'typedi';
import { HistoryRepository } from '@service/domain/history/history-repository';
import { HistoryEntry } from '@service/domain/history/history-entry';
import { User } from '@service/domain/users/user';
import { HistorySummary, SongPopularity, UserPopularity } from '@service/domain/history/history-summary';
import { SongsService } from '@service/domain/songs/songs-service';
import { UsersService } from '@service/domain/users/users-service';

@Service()
class HistoryService {
  constructor(
    private repository: HistoryRepository,
    private songsService: SongsService,
    private userService: UsersService,
  ) { }

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

  async generateSummary(dateFrom: string, dateTo: string): Promise<HistorySummary> {
    const history = await this.repository.findInDateRangeOrderByDateDesc(dateFrom, dateTo);

    const songIdToPlayCount: Map<string, number> = history
      .map((e) => e.youtubeId)
      .countOccurrences();

    const usernameToPlayCount: Map<string, number> = history
      .map((e) => e.user || 'unknown')
      .countOccurrences();

    const mostPopularSongs: SongPopularity[] = (await this.songsService.getSongsByYoutubeIds([...songIdToPlayCount.keys()]))
      .map((song) => ({ song, playCount: (songIdToPlayCount.get(song.youtubeId) || 0) }))
      .sort((a, b) => (b.playCount - a.playCount));

    const mostActiveUsers: UserPopularity[] = (await this.userService.getByNames([...usernameToPlayCount.keys()]))
      .map((user) => user.data)
      .map((userData) => ({ user: userData, playCount: (usernameToPlayCount.get(userData.name) || 0) }))
      .sort((a, b) => (b.playCount - a.playCount));

    return {
      mostPopularSongs,
      mostActiveUsers,
    };
  }
}

export { HistoryService };
