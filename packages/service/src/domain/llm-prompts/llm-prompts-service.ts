import { Logger } from '@service/infrastructure/logger';
import { Service } from 'typedi';
import { LLMPrompt, LLMPromptType, LLMPromptTypeVariants } from '@service/domain/llm-prompts/llm-prompts';
import { LLMPromptsRepository } from '@service/domain/llm-prompts/llm-prompts-repository';
import { User } from '@service/domain/users/user';
import { notNull } from '@service/utils/utils';

@Service()
class LLMPromptsService {
  private static logger = new Logger('radio-personality-prompt-service');

  constructor(private llmPromptsRepository: LLMPromptsRepository) { }

  public async addNewPrompt(text: string, temperatureOverride: (number | null), type: LLMPromptType, variant: string, deprecated: boolean, user: User): Promise<LLMPrompt | null> {
    const prompt: LLMPrompt = {
      text,
      temperatureOverride,
      type,
      variant,
      deprecated,
      creationDate: new Date(),
      addedBy: user.data.name,
    };

    try {
      this.llmPromptsRepository.insert(prompt);
      LLMPromptsService.logger.info(`Added new prompt for type "${type}", text: "${text}".`);
      return prompt;
    } catch (err) {
      LLMPromptsService.logger.error('Error while adding new prompt');
      LLMPromptsService.logger.withError(err as Error);
      return null;
    }
  }

  async getTypeVariants(): Promise<LLMPromptTypeVariants> {
    return {
      [LLMPromptType.NewSongStartedPlaying]: await this.llmPromptsRepository.findAllVariantsByType(LLMPromptType.NewSongStartedPlaying),
      [LLMPromptType.ListenerCalling]: await this.llmPromptsRepository.findAllVariantsByType(LLMPromptType.ListenerCalling),
    };
  }

  async getActivePromptForTypeVariant(type: LLMPromptType, variant: string): Promise<LLMPrompt | null> {
    const latestPrompt = await this.llmPromptsRepository.findOneByTypeVariantOrderByDateDesc(type, variant);
    if (!latestPrompt || latestPrompt.deprecated) {
      return null;
    }
    return latestPrompt;
  }

  async getAllPromptsForTypeVariant(type: LLMPromptType, variant: string): Promise<LLMPrompt[]> {
    return this.llmPromptsRepository.findAllByTypeVariantOrderByDateDesc(type, variant);
  }

  async getActivePromptsForType(type: LLMPromptType): Promise<LLMPrompt[]> {
    const typeVariants = await this.getTypeVariants();
    const variants = typeVariants[type];
    const prompts = await Promise.all(variants.map((variant) => this.getActivePromptForTypeVariant(type, variant)));
    return prompts.filter(notNull);
  }

  async getRandomActivePromptForType(type: LLMPromptType): Promise<LLMPrompt | null> {
    const prompts = await this.getActivePromptsForType(type);

    if (prompts.length === 0) {
      return null;
    }

    return prompts.randomShuffle()[0];
  }
}

export {
  LLMPromptsService,
};
