import { XSound } from '@service/domain/x-sounds/x-sound';
import { Repository } from '@service/infrastructure/repository';
import { Service } from 'typedi';
import { DatabaseClient } from '@service/infrastructure/storage';
import { Configuration } from '@service/infrastructure/configuration';

@Service()
class XSoundsRepository extends Repository<XSound> {
  private constructor(storage: DatabaseClient, private configuration: Configuration) {
    super('x', storage);
  }

  findAllOrderByNameAsc(): Promise<XSound[]> {
    return this.collection.find({}).collation({ locale: this.configuration.LOCALE }).sort({ name: 1 }).toArray();
  }

  findAllByTagOrderByNameAsc(tag: string): Promise<XSound[]> {
    return this.collection.find({ tags: tag }).sort({ name: 1 }).toArray();
  }

  findByName(name: string): Promise<XSound | null> {
    return this.collection.findOne({ name });
  }

  async insert(sound: XSound): Promise<void> {
    await this.collection.insertOne(sound);
  }

  async replace(sound: XSound): Promise<void> {
    await this.collection.replaceOne({ _id: sound._id }, sound);
  }
}

export { XSoundsRepository };
