import { Command } from '@service/domain/commands/model/command';
import { SayCommand } from '@service/domain/commands/processors/say-command';
import { LLMGenerator } from '@service/infrastructure/llm-generator';
import Container, { Service } from 'typedi';
import { Song } from '@service/domain/songs/song';

@Service()
class RadioPersonalityService {
  private lastOnNowPlayingChangedTime: number = 0;

  constructor(private llmGenerator: LLMGenerator) { }

  public async onNowPlayingChanged(song: Song): Promise<void> {
    const timeNow = Date.now();
    if ((timeNow - this.lastOnNowPlayingChangedTime) < (10 * 1000)) {
      return;
    }
    this.lastOnNowPlayingChangedTime = timeNow;

    const prompt = `Jesteś prezenterem radiowym w radiu LebkuchenFM. Na końcu tej wiadomości otrzymasz informację o dodanym utworze. W odpowiedzi oczekuję wiadomości którą jako prezenter radiowy wypowiesz na antenie. Oczekuje maksymalnie dwa BARDZO KRÓTKIE zdania, maksymalny poziom żartu, możesz obrażać słuchaczy i przeklinać. Dodano utwór "${song.name}".`;
    const radioPersonalityResponse = await this.llmGenerator.generateTextForPrompt(prompt);
    if (radioPersonalityResponse) {
      const sayCommand = new Command('say', radioPersonalityResponse);
      await Container.get(SayCommand).execute(sayCommand);
    }
  }
}

export { RadioPersonalityService };
