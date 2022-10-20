import { HistoryEntry } from '@service/domain/history/history-entry';
import { Repository } from '@service/infrastructure/repository';
import { DatabaseClient } from '@service/infrastructure/storage';
import { Service } from 'typedi';

@Service()
class HistoryRepository extends Repository<HistoryEntry> {
  private constructor(storage: DatabaseClient) {
    super('history', storage);
  }

  async findAllOrderByDateDesc(): Promise<HistoryEntry[]> {
    return this.collection.find({}).sort({ date: -1 }).toArray();
  }

  async findInDateRangeOrderByDateDesc(dateFrom: string, dateTo: string): Promise<HistoryEntry[]> {
    const gte = new Date(`${dateFrom}T00:00:00.000Z`);
    const lt = new Date(`${dateTo}T00:00:00.000Z`);

    return this.collection
      .find({ date: { $gte: gte, $lt: lt } })
      .sort({ date: -1 })
      .toArray();
  }

  async insert(history: HistoryEntry): Promise<void> {
    await this.collection.insertOne(history);
  }
}

export { HistoryRepository };
