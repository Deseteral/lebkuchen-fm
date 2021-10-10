import { Collection } from 'mongodb';
import Storage from '@service/infrastructure/storage';

abstract class Repository<T> {
  private collectionName: string;
  private storage: Storage;

  constructor(collectionName: string, storage: Storage) {
    this.collectionName = collectionName;
    this.storage = storage;
  }

  protected get collection(): Collection<T> {
    return this.storage.collection<T>(this.collectionName);
  }
}

export default Repository;
