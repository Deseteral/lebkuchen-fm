import { Collection } from 'mongodb';
import Storage from './storage';

abstract class Repository<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected get collection(): Collection<T> {
    return Storage.instance.collection<T>(this.collectionName);
  }
}

export default Repository;
