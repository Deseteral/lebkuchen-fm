import Song from '@service/domain/songs/song';
import Repository from '@service/infrastructure/repository';
import Storage from '@service/infrastructure/storage';
import { Service } from 'typedi';

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
