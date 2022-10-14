import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { Song } from '@service/domain/songs/song';
import { SongsService } from '@service/domain/songs/songs-service';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class SongTopCommand extends CommandProcessor {
  constructor(private songService: SongsService) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const amount = (!command.rawArgs)
      ? 10
      : parseInt(command.rawArgs, 10);

    const topSongs = await this.songService.getTop(amount);
    const text = this.buildMessage(topSongs);

    return new CommandProcessingResponseBuilder()
      .fromMarkdown(text)
      .build();
  }

  private buildMessage(songsList: Song[]): string {
    const titleMessages = songsList
      .map((song, index) => {
        const place = `${index + 1}`.padEnd(5);
        const played = song.timesPlayed.toString().padEnd(8);
        const title = song.name;
        return place + played + title.replace(/(.{50})..+/, '$1…');
      });

    const text = [
      '#    grano   tytuł',
      '------------------------',
      ...titleMessages,
    ].filter(Boolean).join('\n');
    return text;
  }

  get key(): string {
    return 'song-top';
  }

  get shortKey(): (string | null) {
    return 'top';
  }

  get helpMessage(): string {
    return 'Pokazuje najczęściej odtwarzane utwory';
  }

  get exampleUsages(): string[] {
    return [
      '',
      '3',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withOptional('limit')
      .withDelimeter(' ')
      .build();
  }
}

export { SongTopCommand };
