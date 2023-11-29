import { UserData } from '@service/domain/users/user';
import { Song } from '@service/lib';

export interface SongPopularity {
  song: Song,
  playCount: number,
}

export interface UserPopularity {
  user: UserData,
  playCount: number,
  favoriteSong: (SongPopularity | null),
}

export interface HistorySummary {
  mostPopularSongs: SongPopularity[],
  totalSongPlayCount: number,
  mostActiveUsers: UserPopularity[],
}

export interface YearlyHistorySummary {
  label: string,
  url: string,
}
