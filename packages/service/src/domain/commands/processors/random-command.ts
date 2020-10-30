import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse from '../model/command-processing-response';
import SongsService from '../../songs/songs-service';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import { AddSongsToQueueEvent } from '../../../event-stream/model/events';

const MAX_TITLES_IN_MESSAGE = 10;

async function randomCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const amount = (command.rawArgs === '')
    ? 1
    : parseInt(command.rawArgs, 10);

  const songsList = await SongsService.instance.getAll();
  const maxAllowedValue = songsList.length;

  if (Number.isNaN(amount) || (amount < 1 || amount > maxAllowedValue)) {
    throw new Error(`Nieprawidłowa liczba utworów ${command.rawArgs}, podaj liczbę z zakresu 1-${maxAllowedValue}`);
  }

  const selectedSongs = songsList.randomShuffle().slice(0, amount);

  const eventData: AddSongsToQueueEvent = { id: 'AddSongsToQueueEvent', songs: selectedSongs };
  PlayerEventStream.instance.sendToEveryone(eventData);

  selectedSongs.forEach((song) => {
    SongsService.instance.incrementPlayCount(song.youtubeId, song.name);
  });

  const titleMessages = selectedSongs
    .map((s) => s.name)
    .slice(0, MAX_TITLES_IN_MESSAGE)
    .map((title) => `- _${title}_`);

  const text = [
    'Dodano do kojeki:',
    ...titleMessages,
    ((selectedSongs.length > MAX_TITLES_IN_MESSAGE) ? `...i ${selectedSongs.length - MAX_TITLES_IN_MESSAGE} więcej` : ''),
  ].filter(Boolean).join('\n');

  return {
    messages: [{
      text,
      type: 'MARKDOWN',
    }],
    isVisibleToIssuerOnly: false,
  };
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
