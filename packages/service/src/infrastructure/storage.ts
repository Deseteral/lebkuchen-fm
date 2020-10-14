import { Collection, Db, MongoClient } from 'mongodb';
import Configuration from '../application/configuration';
import Logger from '../infrastructure/logger';

class Storage {
  private static logger = new Logger('mongo-client');
  private client: MongoClient;
  private db?: Db;

  private constructor() {
    this.client = new MongoClient(Configuration.MONGODB_URI, { useUnifiedTopology: true });
  }

  async connect(): Promise<void> {
    await this.client.connect();

    this.db = this.client.db(Configuration.DATABASE_NAME);
    await this.db.command({ ping: 1 });

    Storage.logger.info('Connected to MongoDB server');
  }

  collection<T>(collectionName: string): Collection<T> {
    if (!this.db) {
      throw new Error('Storage must be connected before calling collection');
    }
    return this.db.collection(collectionName);
  }

  static readonly instance: Storage = new Storage();
}

export default Storage;
