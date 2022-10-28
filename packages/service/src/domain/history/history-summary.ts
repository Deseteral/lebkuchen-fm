import { UserData } from '@service/domain/users/user';
import { Song } from '@service/lib';

export interface SongPopularity {
  song: Song,
  playCount: number,
}

export interface UserPopularity {
  user: UserData,
  playCount: number,
}

export interface HistorySummary {
  mostPopularSongs: SongPopularity[],
  mostActiveUsers: UserPopularity[],
}
