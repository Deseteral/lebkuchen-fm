import { Logger } from '@service/infrastructure/logger';
import { Service } from 'typedi';
import { LLMPrompt, LLMPromptType } from '@service/domain/llm-prompts/llm-prompts';
import { LLMPromptsRepository } from '@service/domain/llm-prompts/llm-prompts-repository';

@Service()
class LLMPromptsService {
  private static logger = new Logger('radio-personality-prompt-service');

  constructor(private llmPromptsRepository: LLMPromptsRepository) { }

  public async getPromptForType(type: LLMPromptType): Promise<LLMPrompt | null> {
    return this.llmPromptsRepository.findOneByTypeOrderByDateDesc(type);
  }

  public async addNewPrompt(text: string, type: LLMPromptType): Promise<void> {
    const prompt: LLMPrompt = {
      text,
      type,
      creationDate: new Date(),
    };

    try {
      this.llmPromptsRepository.insert(prompt);
      LLMPromptsService.logger.info(`Added new prompt for type "${type}", text: "${text}".`);
    } catch (err) {
      LLMPromptsService.logger.error('Error while adding new prompt');
      LLMPromptsService.logger.withError(err as Error);
    }
  }
}

export {
  LLMPromptsService,
};
