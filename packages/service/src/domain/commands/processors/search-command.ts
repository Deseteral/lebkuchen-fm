import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { QueueCommand } from '@service/domain/commands/processors/queue-command';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { YouTubeDataClient } from '@service/youtube/youtube-data-client';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class SearchCommand extends CommandProcessor {
  constructor(private queueProcessor: QueueCommand, private youTubeDataClient: YouTubeDataClient) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const phrase = command.rawArgs;
    const youtubeId = await this.youTubeDataClient.fetchFirstYouTubeIdForPhrase(phrase);

    const queueCommand = new Command('queue', youtubeId);
    return this.queueProcessor.execute(queueCommand);
  }

  get key(): string {
    return 'search';
  }

  get shortKey(): (string | null) {
    return 's';
  }

  get helpMessage(): string {
    return 'Kolejkuje pierwszy wynik wyszukiwania danej frazy na YouTube';
  }

  get helpUsages(): (string[] | null) {
    return [
      '<phrase>',
      'krawczyk parostatek',
    ];
  }
}

export { SearchCommand };
