import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as SongService from '../../songs/song-service';
import QueueCommand from './queue-command';

async function randomCommandProcessor(command: Command) : Promise<CommandProcessingResponse> {
  const amount = command.rawArgs === ''
    ? 1
    : parseInt(command.rawArgs, 10);

  const songList = await SongService.getAll();
  const maxAllowedValue = songList.length;

  if (Number.isNaN(amount) || (amount < 1 || amount > maxAllowedValue)) {
    return makeSingleTextProcessingResponse(`Nieprawidłowa liczba utworów ${command.rawArgs}, podaj liczbę z zakresu 1-${maxAllowedValue}`, false);
  }

  const shuffledSongList = [...songList].sort(() => (0.5 - Math.random()));
  const selectedSongs = shuffledSongList.slice(0, amount);

  // TODO: Render titles
  selectedSongs.forEach(async (song) => {
    const queueCommand: Command = { key: 'queue', rawArgs: song.youtubeId };
    await QueueCommand.processor(queueCommand);
  });

  return makeSingleTextProcessingResponse(`Dodano do kolejki "${amount}" utworów`, false);
}

const randomCommandDefinition: CommandDefinition = {
  key: 'random',
  processor: randomCommandProcessor,
  helpMessage: 'Losuje utwory z historii',
};

export default randomCommandDefinition;
