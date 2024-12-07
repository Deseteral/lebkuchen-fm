import { Repository } from '@service/infrastructure/repository';
import { DatabaseClient } from '@service/infrastructure/storage';
import { Service } from 'typedi';
import { LLMPrompt, LLMPromptType } from '@service/domain/llm-prompts/llm-prompts';

@Service()
class LLMPromptsRepository extends Repository<LLMPrompt> {
  private constructor(storage: DatabaseClient) {
    super('llm-prompts', storage);
  }

  async findAllVariantsByType(type: LLMPromptType): Promise<string[]> {
    const result = await this.collection.aggregate([
      { $match: { type } },
      { $group: { _id: { variant: '$variant' } } },
    ]).toArray();

    return result.map((doc) => doc._id.variant);
  }

  async findOneByTypeVariantOrderByDateDesc(type: LLMPromptType, variant: string): Promise<LLMPrompt | null> {
    const result = await this.collection
      .find({ type, variant })
      .sort({ creationDate: -1 })
      .limit(1)
      .toArray();

    return result[0] || null;
  }

  async findAllByTypeVariantOrderByDateDesc(type: LLMPromptType, variant: string): Promise<LLMPrompt[]> {
    return this.collection
      .find({ type, variant })
      .sort({ creationDate: -1 })
      .toArray();
  }

  async insert(prompt: LLMPrompt): Promise<void> {
    await this.collection.insertOne(prompt);
  }
}

export {
  LLMPromptsRepository,
};
