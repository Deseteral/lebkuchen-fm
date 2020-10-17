import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse from '../model/command-processing-response';
import YouTubeDataClient from '../../../youtube/youtube-data-client';
import QueueCommand from './queue-command';

async function searchCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const commandArgs = command.getArgsByDelimiter(' ');
  let phrase: string;
  let options: string;

  if (commandArgs.length > 1 && commandArgs[0] === '-n') {
    commandArgs.shift();
    phrase = commandArgs.join(' ');
    options = '-n';
  } else {
    phrase = command.rawArgs;
    options = '';
  }

  const youtubeId = await YouTubeDataClient.fetchFirstYouTubeIdForPhrase(phrase);
  const args = (options === '') ? youtubeId : `${options} ${youtubeId}`;
  const queueCommand = new Command('queue', args);

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
