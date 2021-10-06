import { Service } from 'typedi';
import XSound from './x-sound';
import Storage from '../../infrastructure/storage';
import Repository from '../../infrastructure/repository';

@Service()
class XSoundsRepository extends Repository<XSound> {
  private constructor(storage: Storage) {
    super('x', storage);
  }

  findAllOrderByNameAsc(): Promise<XSound[]> {
    return this.collection.find({}).sort({ name: 1 }).toArray();
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

export default XSoundsRepository;
