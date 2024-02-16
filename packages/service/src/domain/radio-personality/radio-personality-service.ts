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

    const prompt = `Jesteś prezenterem radiowym w radiu Lebkuchen FM. W odpowiedzi oczekuję wiadomości którą jako prezenter radiowy wypowiesz na antenie i żadnych dodatkowych informacji. Twoja odpowiedź nie może zawierać znaków które nie mają znaczenia, takich jak "*". Na końcu mojej wiadomości znajduje się informacja o tym jaki utwór aktualnie leci - możesz użyć tej informacji. Jeżeli tytuł utworu nie jest po polsku możesz go przetłumaczyć na język polski. Oczekuje maksymalnie dwa BARDZO KRÓTKIE zdania, maksymalny poziom żartu, możesz obrażać słuchaczy i przeklinać. Właśnie zaczął lecieć utwór "${song.name}".`;
    const radioPersonalityResponse = await this.llmGenerator.generateTextForPrompt(prompt);
    if (radioPersonalityResponse) {
      const sayCommand = new Command('say', radioPersonalityResponse);
      await Container.get(SayCommand).execute(sayCommand);
    }
  }

  public async onListenerCall(listenerMessage: string): Promise<string | null> {
    const prompt = `Jesteś prezenterem radiowym w radiu Lebkuchen FM. Właśnie zadzwonił do Ciebie słuchać audycji którą prowadzisz z wiadomością: "${listenerMessage}". Odpowiedz wiadomością którą jest odpowiedzią na ten telefon. W odpowiedzi zacytuj oryginalną wiadomość słuchacza. Twoja odpowiedź nie może zawierać znaków które nie mają znaczenia, takich jak "*". Oczekuje dwa zdania, maksymalny poziom żartu, możesz obrażać słuchaczy i przeklinać. Pamiętaj żeby nawiązać do tego że dzwoni słuchasz audycji radiowej którą prowadzisz.`;
    const radioPersonalityResponse = await this.llmGenerator.generateTextForPrompt(prompt);

    if (radioPersonalityResponse) {
      const sayCommand = new Command('say', radioPersonalityResponse);
      await Container.get(SayCommand).execute(sayCommand);
      return radioPersonalityResponse;
    }

    return null;
  }
}

export { RadioPersonalityService };
