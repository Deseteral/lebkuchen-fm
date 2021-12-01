import Song from '@service/domain/songs/song';
import { Service } from 'typedi';
import HistoryRepository from '@service/domain/history/history-repository';
import { HistoryEntry } from '@service/domain/history/history-entry';

@Service()
class HistoryService {
  constructor(private repository: HistoryRepository) { }

  async markAsPlayed(song: Song): Promise<void> {
    const entry: HistoryEntry = {
      date: new Date(),
      youtubeId: song.youtubeId,
    };

    this.repository.insert(entry);
  }
}

export default HistoryService;
