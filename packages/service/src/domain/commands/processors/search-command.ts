import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse from '../model/command-processing-response';
import * as YouTubeDataClient from '../../../youtube/youtube-data-client';
import QueueCommand from './queue-command';

async function searchCommandProcessor(command: Command) : Promise<CommandProcessingResponse> {
  const phrase = command.rawArgs;
  const youtubeId = await YouTubeDataClient.fetchFirstYouTubeIdForPhrase(phrase);

  const queueCommand = new Command('queue', youtubeId);
  return QueueCommand.processor(queueCommand);
}

const searchCommandDefinition: CommandDefinition = {
  key: 'search',
  shortKey: 's',
  processor: searchCommandProcessor,
  helpMessage: 'Kolejkuje pierwszy wynik wyszukiwania danej frazy na YouTube',
  helpUsages: [
    '<phrase>',
    'krawczyk parostatek',
  ],
};

export default searchCommandDefinition;
