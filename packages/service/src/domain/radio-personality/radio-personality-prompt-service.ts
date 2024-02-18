import { Logger } from '@service/infrastructure/logger';
import { Service } from 'typedi';
import { RadioPersonalityPrompt, RadioPersonalityPromptType } from './radio-personality-prompt';
import { RadioPersonalityPromptRepository } from './radio-personality-prompt-repository';

@Service()
class RadioPersonalityPromptService {
  private static logger = new Logger('radio-personality-prompt-service');

  constructor(private radioPersonalityPromptRepository: RadioPersonalityPromptRepository) { }

  public async getPromptForType(type: RadioPersonalityPromptType): Promise<RadioPersonalityPrompt | null> {
    return this.radioPersonalityPromptRepository.findOneByTypeOrderByDateDesc(type);
  }

  public async addNewPrompt(text: string, type: RadioPersonalityPromptType): Promise<void> {
    const prompt: RadioPersonalityPrompt = {
      text,
      type,
      creationDate: new Date(),
    };

    try {
      this.radioPersonalityPromptRepository.insert(prompt);
      RadioPersonalityPromptService.logger.info(`Added new prompt for type "${type}", text: "${text}".`);
    } catch (err) {
      RadioPersonalityPromptService.logger.error('Error while adding new prompt');
      RadioPersonalityPromptService.logger.withError(err as Error);
    }
  }
}

export {
  RadioPersonalityPromptService,
};
