import { Service } from 'typedi';
import Song from './song';
import Storage from '../../infrastructure/storage';
import Repository from '../../infrastructure/repository';

@Service()
class SongsRepository extends Repository<Song> {
  private constructor(storage: Storage) {
    super('songs', storage);
  }

  findAllOrderByTimesPlayedDesc(): Promise<Song[]> {
    return this.collection.find({}).sort({ timesPlayed: -1 }).toArray();
  }

  findByName(name: string): Promise<Song | null> {
    return this.collection.findOne({ name });
  }

  findByYoutubeId(youtubeId: string): Promise<Song | null> {
    return this.collection.findOne({ youtubeId });
  }

  async insert(song: Song): Promise<void> {
    await this.collection.insertOne(song);
  }

  async replace(song: Song): Promise<void> {
    await this.collection.replaceOne({ _id: song._id }, song);
  }
}

export default SongsRepository;
