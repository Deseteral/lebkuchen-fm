import { Song } from '@service/domain/songs/song';
import { Repository } from '@service/infrastructure/repository';
import { DatabaseClient } from '@service/infrastructure/storage';
import { Service } from 'typedi';

@Service()
class SongsRepository extends Repository<Song> {
  private constructor(storage: DatabaseClient) {
    super('songs', storage);
  }

  findAllOrderedByTimesPlayedDesc(limit: number = 0): Promise<Song[]> {
    return this.collection.find().sort({ timesPlayed: -1 }).limit(limit).toArray();
  }

  findByName(name: string): Promise<Song | null> {
    return this.collection.findOne({ name });
  }

  findByYoutubeId(youtubeId: string): Promise<Song | null> {
    return this.collection.findOne({ youtubeId });
  }

  findByYoutubeIds(youtubeIds: string[]): Promise<Song[]> {
    return this.collection.find({ youtubeId: { $in: youtubeIds } }).toArray();
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
