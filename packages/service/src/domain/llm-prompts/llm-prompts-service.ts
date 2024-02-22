import { Logger } from '@service/infrastructure/logger';
import { Service } from 'typedi';
import { LLMPrompt, LLMPromptType } from '@service/domain/llm-prompts/llm-prompts';
import { LLMPromptsRepository } from '@service/domain/llm-prompts/llm-prompts-repository';
import { notNull } from '@service/utils/utils';

@Service()
class LLMPromptsService {
  private static logger = new Logger('radio-personality-prompt-service');

  constructor(private llmPromptsRepository: LLMPromptsRepository) { }

  public async getPromptForType(type: LLMPromptType): Promise<LLMPrompt | null> {
    return this.llmPromptsRepository.findOneByTypeOrderByDateDesc(type);
  }

  public async getAllPrompts(): Promise<LLMPrompt[]> {
    const prompts = await Promise.all(
      Object.values(LLMPromptType)
        .map((type: LLMPromptType) => this.getPromptForType(type)),
    );

    return prompts.filter(notNull);
  }

  public async addNewPrompt(text: string, type: LLMPromptType, variant: string, deprecated: boolean): Promise<LLMPrompt | null> {
    const prompt: LLMPrompt = {
      text,
      type,
      variant,
      deprecated,
      creationDate: new Date(),
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
}

export {
  LLMPromptsService,
};
