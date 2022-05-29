import { User } from '@service/domain/users/user';
import { XSound } from '@service/domain/x-sounds/x-sound';
import { XSoundsRepository } from '@service/domain/x-sounds/x-sounds-repository';
import { FileStorage } from '@service/infrastructure/file-storage';
import path from 'path';
import { Service } from 'typedi';

@Service()
class XSoundsService {
  constructor(private repository: XSoundsRepository, private fileStorage: FileStorage) { }

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

  async getAllByTag(tag: string): Promise<XSound[]> {
    return this.repository.findAllByTagOrderByNameAsc(tag);
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

  async addTag(soundName: string, tag: string): Promise<void> {
    const xSound = await this.repository.findByName(soundName);

    if (!xSound) {
      throw new Error(`Dźwięk "${soundName}" nie istnieje`);
    }

    const tags: string[] = (xSound.tags || []);
    const updatedSound: XSound = {
      ...xSound,
      tags: Array.from(new Set([...tags, tag])),
    };

    await this.repository.replace(updatedSound);
  }

  async removeTag(soundName: string, tag: string): Promise<void> {
    const xSound = await this.repository.findByName(soundName);

    if (!xSound) {
      throw new Error(`Dźwięk "${soundName}" nie istnieje`);
    }

    const tags: string[] = (xSound.tags || []);

    const searchIndex = tags.indexOf(tag);
    if (searchIndex > -1) {
      tags.splice(searchIndex, 1);
    }

    const updatedSound: XSound = {
      ...xSound,
      tags,
    };

    await this.repository.replace(updatedSound);
  }

  async getSoundTags(soundName: string): Promise<string[]> {
    const xSound = await this.repository.findByName(soundName);

    if (!xSound) {
      throw new Error(`Dźwięk "${soundName}" nie istnieje`);
    }

    return (xSound.tags || []);
  }

  async getAllUniqueTags(): Promise<string[]> {
    const sounds = await this.getAll();
    const tags = sounds.flatMap((sound) => (sound.tags || []));
    const uniqueTags = Array.from(new Set(tags));
    const sortedTags = uniqueTags.sort();

    return sortedTags;
  }

  async createNewSound(
    name: string,
    fileDescriptor: { buffer: Buffer, fileName: string },
    user: User,
    timesPlayed = 0,
  ): Promise<XSound> {
    const exists = await this.soundExists(name);
    if (exists) {
      throw new Error(`Dźwięk o nazwie "${name}" już jest w bazie`);
    }

    const fileExtension = path.extname(fileDescriptor.fileName);
    const { url } = await this.fileStorage.uploadFile({
      path: `/xsounds/${name}${fileExtension}`,
      contents: fileDescriptor.buffer,
    });

    const xSound: XSound = {
      name,
      url,
      timesPlayed,
      tags: [],
      addedBy: user.data.name,
    };

    await this.repository.insert(xSound);

    return xSound;
  }
}

export { XSoundsService };
