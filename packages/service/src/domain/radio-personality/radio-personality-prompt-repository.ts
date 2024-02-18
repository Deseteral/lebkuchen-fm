import { Repository } from '@service/infrastructure/repository';
import { DatabaseClient } from '@service/infrastructure/storage';
import { Service } from 'typedi';
import { RadioPersonalityPrompt, RadioPersonalityPromptType } from './radio-personality-prompt';

@Service()
class RadioPersonalityPromptRepository extends Repository<RadioPersonalityPrompt> {
  private constructor(storage: DatabaseClient) {
    super('radioPersonalityPrompts', storage);
  }

  async findOneByTypeOrderByDateDesc(type: RadioPersonalityPromptType): Promise<RadioPersonalityPrompt | null> {
    const array = await this.collection.find({ type }).sort({ creationDate: -1 }).limit(1).toArray();
    return array[0] || null;
  }

  async insert(prompt: RadioPersonalityPrompt): Promise<void> {
    await this.collection.insertOne(prompt);
  }
}

export { RadioPersonalityPromptRepository };
