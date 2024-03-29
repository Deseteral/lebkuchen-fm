import { ExecutionContext } from '@service/domain/commands/execution-context';
import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { SongQueueCommand } from '@service/domain/commands/processors/song-queue-command';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { YouTubeDataClient } from '@service/youtube/youtube-data-client';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class SongSearchCommand extends CommandProcessor {
  constructor(private queueProcessor: SongQueueCommand, private youTubeDataClient: YouTubeDataClient) {
    super();
  }

  async execute(command: Command, context: ExecutionContext): Promise<CommandProcessingResponse> {
    const phrase = command.rawArgs;

    if (!phrase) {
      throw new Error('You have to provide search phrase');
    }

    const youtubeId = await this.youTubeDataClient.fetchFirstYouTubeIdForPhrase(phrase);

    const queueCommand = new Command('queue', youtubeId);
    return this.queueProcessor.execute(queueCommand, context);
  }

  get key(): string {
    return 'song-search';
  }

  get shortKey(): (string | null) {
    return 's';
  }

  get helpMessage(): string {
    return 'Kolejkuje pierwszy wynik wyszukiwania danej frazy na YouTube';
  }

  get exampleUsages(): string[] {
    return [
      'krawczyk parostatek',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withRequired('phrase')
      .build();
  }
}

export { SongSearchCommand };
