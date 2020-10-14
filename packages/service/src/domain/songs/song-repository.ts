import Repository from '../../infrastructure/repository';
import Song from './song';

class SongRepository extends Repository<Song> {
  private constructor() {
    super('songs');
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

  static readonly instance = new SongRepository();
}

export default SongRepository;
