import { Song } from '@service/domain/songs/song';
import { Repository } from '@service/infrastructure/repository';
import { DatabaseClient } from '@service/infrastructure/storage';
import { Service } from 'typedi';

@Service()
class SongsRepository extends Repository<Song> {
  private constructor(storage: DatabaseClient) {
    super('songs', storage);
  }

  findAllOrderByTimesPlayedDesc(): Promise<Song[]> {
    return this.collection.find({}, { projection: { _id: 0 } }).sort({ timesPlayed: -1 }).toArray();
  }

  findByName(name: string): Promise<Song | null> {
    return this.collection.findOne({ name }, { projection: { _id: 0 } });
  }

  findByYoutubeId(youtubeId: string): Promise<Song | null> {
    return this.collection.findOne({ youtubeId }, { projection: { _id: 0 } });
  }

  findByYoutubeIds(youtubeIds: string[]): Promise<Song[]> {
    return this.collection.find({ youtubeId: { $in: youtubeIds } }, { projection: { _id: 0 } }).toArray();
  }

  async insert(song: Song): Promise<void> {
    await this.collection.insertOne(song);
  }

  async insertMany(songs: Song[]): Promise<void> {
    await this.collection.insertMany(songs);
  }

  async replace(song: Song): Promise<void> {
    await this.collection.replaceOne({ _id: song._id }, song);
  }
}

export { SongsRepository };
