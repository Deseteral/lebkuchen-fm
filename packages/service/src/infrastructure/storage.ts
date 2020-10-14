import { Collection, MongoClient } from 'mongodb';
import Configuration from '../application/configuration';
import Logger from '../infrastructure/logger';

const logger = new Logger('mongo-client');

const client = new MongoClient(Configuration.MONGODB_URI, { useUnifiedTopology: true });

async function connect(): Promise<void> {
  await client.connect();

  const databaseName = Configuration.DATABASE_NAME;
  await client.db(databaseName).command({ ping: 1 });

  logger.info('Connected to MongoDB server');
}

function collection<T>(collectionName: string): Collection<T> {
  const databaseName = Configuration.DATABASE_NAME;
  return client.db(databaseName).collection(collectionName);
}

export {
  connect,
  collection,
};
