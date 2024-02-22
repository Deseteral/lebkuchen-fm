import { Repository } from '@service/infrastructure/repository';
import { DatabaseClient } from '@service/infrastructure/storage';
import { Service } from 'typedi';
import { LLMPrompt, LLMPromptType } from '@service/domain/llm-prompts/llm-prompts';

@Service()
class LLMPromptsRepository extends Repository<LLMPrompt> {
  private constructor(storage: DatabaseClient) {
    super('llm-prompts', storage);
  }

  async findOneByTypeOrderByDateDesc(type: LLMPromptType): Promise<LLMPrompt | null> {
    const array = await this.collection.find({ type }).sort({ creationDate: -1 }).limit(1).toArray();
    return array[0] || null;
  }

  async insert(prompt: LLMPrompt): Promise<void> {
    await this.collection.insertOne(prompt);
  }
}

export {
  LLMPromptsRepository,
};