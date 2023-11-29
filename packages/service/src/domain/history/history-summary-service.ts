/* eslint-disable no-continue, no-restricted-syntax, no-await-in-loop */

import { Service } from 'typedi';
import { HistoryRepository } from '@service/domain/history/history-repository';
import { HistorySummary, SongPopularity, UserPopularity } from '@service/domain/history/history-summary';
import { SongsService } from '@service/domain/songs/songs-service';
import { UsersService } from '@service/domain/users/users-service';
import { HistoryEntry } from '@service/domain/history/history-entry';

@Service()
class HistorySummaryService {
  constructor(
    private repository: HistoryRepository,
    private songsService: SongsService,
    private userService: UsersService,
  ) { }

  async getAvailableYears(): Promise<string[]> {
    return (await this.repository.findInDateRangeOrderByDateDesc('1970', '2100'))
      .map((historyEntry) => historyEntry.date.getFullYear().toString())
      .unique();
  }

  async generateSummary(dateFrom: string, dateTo: string, mostPopularSongsLimit?: number): Promise<HistorySummary> {
    const history = await this.repository.findInDateRangeOrderByDateDesc(dateFrom, dateTo);

    const totalSongPlayCount = history.length;

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

    const usersFavoriteSongs = await this.getFavoriteSongsForAllUsers(history);

    const mostActiveUsers: UserPopularity[] = (await this.userService.getByNames([...usernameToPlayCount.keys()]))
      .map((user) => user.data)
      .map((userData) => ({
        user: userData,
        playCount: (usernameToPlayCount.get(userData.name) || 0),
        favoriteSong: (usersFavoriteSongs.get(userData.name) || null),
      }))
      .sort((a, b) => (b.playCount - a.playCount));

    return {
      mostPopularSongs,
      totalSongPlayCount,
      mostActiveUsers,
    };
  }

  private async getFavoriteSongsForAllUsers(history: HistoryEntry[]): Promise<Map<string, SongPopularity>> {
    const userSongs: Map<string, Map<string, number>> = new Map();

    for (const historyEntry of history) {
      const userId = historyEntry.user;
      if (!userId) continue;

      const userCounter: Map<string, number> = userSongs.get(userId) || new Map<string, number>();
      const songPlayCount: number = userCounter.get(historyEntry.youtubeId) || 0;
      userCounter.set(historyEntry.youtubeId, songPlayCount + 1);
      userSongs.set(userId, userCounter);
    }

    const userSongPopularity: Map<string, SongPopularity> = new Map();

    for (const [userName, userCounter] of userSongs.entries()) {
      const [favoriteSongId, playCount] = [...userCounter.entries()].sort((a, b) => b[1] - a[1])[0];
      const song = (await this.songsService.getByYoutubeId(favoriteSongId))!;
      userSongPopularity.set(userName, { song, playCount });
    }

    return userSongPopularity;
  }
}

export { HistorySummaryService };
