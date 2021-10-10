import { Collection } from 'mongodb';
import DatabaseClient from '@service/infrastructure/storage';

abstract class Repository<T> {
  private collectionName: string;
  private storage: DatabaseClient;

  constructor(collectionName: string, storage: DatabaseClient) {
    this.collectionName = collectionName;
    this.storage = storage;
  }

  protected get collection(): Collection<T> {
    return this.storage.collection<T>(this.collectionName);
  }
}

export default Repository;
