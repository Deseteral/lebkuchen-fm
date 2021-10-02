import path from 'path';
import fetch from 'node-fetch';
import XSoundsRepository from './x-sounds-repository';
import XSound from './x-sound';
import FileStorage from '../../infrastructure/file-storage';
import Logger from '../../infrastructure/logger';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

class XSoundsService {
  private static logger = new Logger('x-sound-service')
  private repository: XSoundsRepository;

  private constructor() {
    this.repository = XSoundsRepository.instance;
  }

  getAll(): Promise<XSound[]> {
    return this.repository.findAllOrderByNameAsc();
  }

  async getByName(soundName: string): Promise<XSound> {
    const xSound = await this.repository.findByName(soundName);

    if (!xSound) {
      throw new Error(`Nie ma takiego dźwięku: ${soundName}`);
    }

    return xSound;
  }

  async soundExists(soundName: string): Promise<boolean> {
    const xSound = await this.repository.findByName(soundName);
    return !!xSound;
  }

  async incrementPlayCount(soundName: string): Promise<void> {
    const xSound = await this.repository.findByName(soundName);

    if (xSound) {
      const updatedSound = {
        ...xSound,
        timesPlayed: (xSound.timesPlayed + 1),
      };

      await this.repository.replace(updatedSound);
    }
  }

  async createNewSound(name: string, fileDescriptor: { buffer: Buffer, fileName: string }, timesPlayed = 0): Promise<XSound> {
    const exists = await this.soundExists(name);
    if (exists) {
      throw new Error(`Dźwięk o nazwie "${name}" już jest w bazie`);
    }

    const fileExtension = path.extname(fileDescriptor.fileName);
    const { url } = await FileStorage.instance.uploadFile({
      path: `/xsounds/${name}${fileExtension}`,
      contents: fileDescriptor.buffer,
    });

    const xSound: XSound = {
      name,
      url,
      timesPlayed,
    };

    await this.repository.insert(xSound);

    return xSound;
  }

  /* eslint-disable no-await-in-loop */
  // TODO: To be removed after migration
  async migration(): Promise<void> {
    const sounds = await this.getAll();

    for (const sound of sounds) { // eslint-disable-line
      console.log(''); // Insert new line for log clarity

      try {
        await this.migrateSound(sound);
        XSoundsService.logger.info(`Migrated sound '${sound.name}'`);

        await delay(1000); // Wait so that Dropbox doesn't get angry (rate limiter)
      } catch (err) {
        XSoundsService.logger.error(`An error occured while migrating sound '${sound.name}'`);
        console.error(err);
      }
    }

    XSoundsService.logger.info('Migration completed');
  }

  async migrateSound(sound: XSound): Promise<void> {
    // Skip migration for already migrated sounds (in case of running this process again)
    if (sound.url.startsWith('https://dl.dropboxusercontent.com')) {
      XSoundsService.logger.info(`Skipping sound '${sound.name}' because it's already on Dropbox`);
      return;
    }

    // Download sound file
    const res = await fetch(sound.url);

    // Report sounds that cannot be downloaded for manual check
    if (res.status !== 200) {
      XSoundsService.logger.info(`Non 200 response for sound: '${sound.name}'`);
      return;
    }

    // Report sounds that don' have .mp3 or .wav extension in their URLs for manual migration.
    //
    // There is only one sound like that - running
    //   db.getCollection('x').find({ url: { $not: /\.mp3$/ } })
    // on production database only returns one wav file and one without extension.
    //
    // That file unfortuneatly is responding with 404, so this check should never trigger
    // but I'm leaving it just in case.
    if (!sound.url.endsWith('.mp3') && !sound.url.endsWith('.wav')) {
      XSoundsService.logger.info(`Sound URL without extension: '${sound.name}'`);
      return;
    }

    const buffer = await res.buffer();

    // Upload sound to Dropbox file storage
    const fileExtension = path.extname(sound.url);
    const { url } = await FileStorage.instance.uploadFile({
      path: `/xsounds/${sound.name}${fileExtension}`,
      contents: buffer,
    });

    // Replace URL in document
    const updatedSound: XSound = {
      ...sound,
      url,
    };
    this.repository.replace(updatedSound);
  }

  static readonly instance = new XSoundsService();
}

export default XSoundsService;
