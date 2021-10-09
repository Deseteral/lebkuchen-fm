import { Service } from 'typedi';
import Command from '../model/command';
import { CommandProcessingResponse } from '../model/command-processing-response';
import YouTubeDataClient from '../../../youtube/youtube-data-client';
import QueueCommand from './queue-command';
import CommandProcessor from '../model/command-processor';
import RegisterCommand from '../registry/register-command';

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

  get shortKey(): string | null {
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

export default SearchCommand;
