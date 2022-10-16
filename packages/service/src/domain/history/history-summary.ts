import { Song } from '@service/lib';

export interface SongPopularity {
  song: Song,
  playCount: number,
}

export interface HistorySummary {
  mostPopularSongs: SongPopularity[]
}
