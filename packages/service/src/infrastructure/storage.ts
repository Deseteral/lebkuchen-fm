import { Db, MongoClient } from 'mongodb';
import * as Configuration from '../application/configuration';
import * as Logger from '../infrastructure/logger';

const client = new MongoClient(Configuration.read().MONGODB_URI, { useUnifiedTopology: true });

async function connect(): Promise<void> {
  await client.connect();

  const databaseName = Configuration.read().DATABASE_NAME;
  await client.db(databaseName).command({ ping: 1 });

  Logger.info('Connected to MongoDB server', 'mongo-client');
}

function getDatabase(): Db {
  const databaseName = Configuration.read().DATABASE_NAME;
  return client.db(databaseName);
}

export { connect, getDatabase };
