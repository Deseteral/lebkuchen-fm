import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse from '../model/command-processing-response';
import YouTubeDataClient from '../../../youtube/youtube-data-client';
import { queueCommandInstance } from './queue-command';

async function searchCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const phrase = command.rawArgs;
  const youtubeId = await YouTubeDataClient.fetchFirstYouTubeIdForPhrase(phrase);

  const queueCommand = new Command('queue', youtubeId);
  return queueCommandInstance.processor(queueCommand);
}

@CommandDefinition.register
export default class SearchCommand implements CommandDefinition {
  key = 'search';
  shortKey = 's';
  processor = searchCommandProcessor;
  helpMessage = 'Kolejkuje pierwszy wynik wyszukiwania danej frazy na YouTube';
  helpUsages = [
    '<phrase>',
    'krawczyk parostatek',
  ];
}
