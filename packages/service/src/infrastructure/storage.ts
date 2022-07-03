import { Configuration } from '@service/infrastructure/configuration';
import { Logger } from '@service/infrastructure/logger';
import { Collection, Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

const DATABASE_NAME = 'lebkuchen-fm';

@Service()
class DatabaseClient {
  private static logger = new Logger('database-client');
  private client: MongoClient;
  private db?: Db;

  constructor(private configuration: Configuration) {
    this.client = new MongoClient(this.configuration.MONGODB_URI);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db(DATABASE_NAME);

    await this.db.command({ ping: 1 });

    DatabaseClient.logger.info('Connected to MongoDB server');
  }

  collection<T>(collectionName: string): Collection<T> {
    if (!this.db) {
      throw new Error('DatabaseClient must be connected before calling collection');
    }
    return this.db.collection(collectionName);
  }
}

export { DatabaseClient };
