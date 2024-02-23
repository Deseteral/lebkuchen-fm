import { Command } from '@service/domain/commands/model/command';
import { SayCommand } from '@service/domain/commands/processors/say-command';
import { LLMGenerator } from '@service/infrastructure/llm-generator';
import Container, { Service } from 'typedi';
import { Song } from '@service/domain/songs/song';
import { LLMPromptsService } from '@service/domain/llm-prompts/llm-prompts-service';
import { LLMPromptType } from '@service/domain/llm-prompts/llm-prompts';

@Service()
class RadioPersonalityService {
  private lastOnNowPlayingChangedTime: number = 0;

  constructor(private llmGenerator: LLMGenerator, private llmPromptsService: LLMPromptsService) { }

  public async onNowPlayingChanged(song: Song): Promise<void> {
    const timeNow = Date.now();
    if ((timeNow - this.lastOnNowPlayingChangedTime) < (10 * 1000)) {
      return;
    }
    this.lastOnNowPlayingChangedTime = timeNow;

    const prompt = await this.llmPromptsService.getRandomActivePromptForType(LLMPromptType.NewSongStartedPlaying);
    if (!prompt) {
      return;
    }

    const promptText = prompt.text.replaceAll('{{currentSongName}}', song.name);
    const radioPersonalityResponse = await this.llmGenerator.generateTextForPrompt(promptText);
    if (radioPersonalityResponse) {
      const sayCommand = new Command('say', radioPersonalityResponse);
      await Container.get(SayCommand).execute(sayCommand);
    }
  }

  public async onListenerCall(listenerMessage: string): Promise<string | null> {
    const prompt = await this.llmPromptsService.getRandomActivePromptForType(LLMPromptType.ListenerCalling);
    if (!prompt) {
      return null;
    }

    const promptText = prompt.text.replaceAll('{{listenerMessage}}', listenerMessage);
    const radioPersonalityResponse = await this.llmGenerator.generateTextForPrompt(promptText);

    if (radioPersonalityResponse) {
      const sayCommand = new Command('say', radioPersonalityResponse);
      await Container.get(SayCommand).execute(sayCommand);
      return radioPersonalityResponse;
    }

    return null;
  }
}

export { RadioPersonalityService };
