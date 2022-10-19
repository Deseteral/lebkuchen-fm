import { Song } from '@service/domain/songs/song';
import { Service } from 'typedi';
import { HistoryRepository } from '@service/domain/history/history-repository';
import { HistoryEntry } from '@service/domain/history/history-entry';
import { User } from '@service/domain/users/user';

@Service()
class HistoryService {
  constructor(private repository: HistoryRepository) { }

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
}

export { HistoryService };
