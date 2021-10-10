import Repository from '../../infrastructure/repository';
import XSound from './x-sound';

class XSoundsRepository extends Repository<XSound> {
  private constructor() {
    super('x');
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

  static readonly instance = new XSoundsRepository();
}

export default XSoundsRepository;
