import { HistoryEntry } from '@service/domain/history/history-entry';
import Repository from '@service/infrastructure/repository';
import DatabaseClient from '@service/infrastructure/storage';
import { Service } from 'typedi';

@Service()
class HistoryRepository extends Repository<HistoryEntry> {
  private constructor(storage: DatabaseClient) {
    super('history', storage);
  }

  async insert(history: HistoryEntry): Promise<void> {
    await this.collection.insertOne(history);
  }
}

export default HistoryRepository;
