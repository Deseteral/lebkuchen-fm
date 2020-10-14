import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import SongService from '../../songs/song-service';
import QueueCommand from './queue-command';

const MAX_TITLES_IN_MESSAGE = 10;

async function randomCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const amount = (command.rawArgs === '')
    ? 1
    : parseInt(command.rawArgs, 10);

  const songList = await SongService.instance.getAll();
  const maxAllowedValue = songList.length;

  if (Number.isNaN(amount) || (amount < 1 || amount > maxAllowedValue)) {
    throw new Error(`Nieprawidłowa liczba utworów ${command.rawArgs}, podaj liczbę z zakresu 1-${maxAllowedValue}`);
  }

  const selectedSongs = [...songList]
    .randomShuffle()
    .slice(0, amount);

  const videoTitles: string[] = [];
  selectedSongs.forEach(async (song) => {
    const queueCommand = new Command('queue', song.youtubeId);
    videoTitles.push(song.name);
    await QueueCommand.processor(queueCommand);
  });

  const titleMessages = videoTitles
    .slice(0, MAX_TITLES_IN_MESSAGE)
    .map((title) => `- ${title}`);

  const message = [
    'Dodano do kojeki:',
    ...titleMessages,
    ((videoTitles.length > MAX_TITLES_IN_MESSAGE) ? `...i ${videoTitles.length - MAX_TITLES_IN_MESSAGE} więcej` : ''),
  ].filter(Boolean).join('\n');

  return makeSingleTextProcessingResponse(message, false);
}

const randomCommandDefinition: CommandDefinition = {
  key: 'random',
  processor: randomCommandProcessor,
  helpMessage: 'Losuje utwory z historii',
  helpUsages: [
    '[amount; defaults to 1]',
    '3',
  ],
};

export default randomCommandDefinition;
