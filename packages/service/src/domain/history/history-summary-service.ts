import { Service } from 'typedi';
import { HistoryRepository } from '@service/domain/history/history-repository';
import { HistorySummary, SongPopularity, UserPopularity } from '@service/domain/history/history-summary';
import { SongsService } from '@service/domain/songs/songs-service';
import { UsersService } from '@service/domain/users/users-service';

@Service()
class HistorySummaryService {
  constructor(
    private repository: HistoryRepository,
    private songsService: SongsService,
    private userService: UsersService,
  ) { }

  async generateSummary(dateFrom: string, dateTo: string, mostPopularSongsLimit?: number): Promise<HistorySummary> {
    const history = await this.repository.findInDateRangeOrderByDateDesc(dateFrom, dateTo);

    const songIdToPlayCount: Map<string, number> = history
      .map((e) => e.youtubeId)
      .countOccurrences();

    const usernameToPlayCount: Map<string, number> = history
      .map((e) => e.user || 'unknown')
      .countOccurrences();

    const mostPopularSongs: SongPopularity[] = (await this.songsService.getSongsByYoutubeIds([...songIdToPlayCount.keys()]))
      .map((song) => ({ song, playCount: (songIdToPlayCount.get(song.youtubeId) || 0) }))
      .sort((a, b) => (b.playCount - a.playCount))
      .slice(0, mostPopularSongsLimit);

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

export { HistorySummaryService };
