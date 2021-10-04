import XSoundsRepository from './x-sounds-repository';
import XSound from './x-sound';

class XSoundsService {
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

  async addTag(soundName: string, tag: string): Promise<void> {
    const xSound = await this.repository.findByName(soundName);

    if (!xSound) {
      throw new Error(`Dźwięk "${soundName}" nie istnieje`);
    }

    const tags = (xSound.tags || []);
    const updatedSound = {
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

    const tags = (xSound.tags || []);

    const searchIndex = tags.indexOf(tag);
    if (searchIndex > -1) {
      tags.splice(searchIndex, 1);
    }

    const updatedSound = {
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

  async createNewSound(name: string, url: string, timesPlayed = 0): Promise<void> {
    const exists = await this.soundExists(name);
    if (exists) {
      throw new Error(`Dźwięk o nazwie "${name}" już jest w bazie`);
    }

    const xSound: XSound = {
      name,
      url,
      timesPlayed,
      tags: [],
    };

    await this.repository.insert(xSound);
  }

  static readonly instance = new XSoundsService();
}

export default XSoundsService;
