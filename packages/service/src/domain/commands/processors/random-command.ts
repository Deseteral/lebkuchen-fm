import { Container } from 'typedi';
import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse from '../model/command-processing-response';
import SongsService from '../../songs/songs-service';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import { AddSongsToQueueEvent } from '../../../event-stream/model/events';
import YouTubeDataClient from '../../../youtube/youtube-data-client';
import Song from '../../songs/song';

const MAX_TITLES_IN_MESSAGE = 10;

function buildMessage(songsToQueue: Song[]): string {
  const titleMessages = songsToQueue
    .map((s) => s.name)
    .slice(0, MAX_TITLES_IN_MESSAGE)
    .map((title) => `- _${title}_`);

  const text = [
    'Dodano do kojeki:',
    ...titleMessages,
    ((songsToQueue.length > MAX_TITLES_IN_MESSAGE) ? `...i ${songsToQueue.length - MAX_TITLES_IN_MESSAGE} więcej` : ''),
  ].filter(Boolean).join('\n');
  return text;
}

async function filterEmbeddableSongs(songs: Song[]): Promise<Song[]> {
  const youtubeIds = songs.map((song) => song.youtubeId);
  const statuses = await YouTubeDataClient.fetchVideosStatuses(youtubeIds);
  const idToEmbeddable: Map<string, boolean> = new Map(statuses.items.map((status) => [status.id, status.status.embeddable]));

  return songs.filter((song) => idToEmbeddable.get(song.youtubeId));
}

async function randomCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const amount = (command.rawArgs === '')
    ? 1
    : parseInt(command.rawArgs, 10);

  const songsList = await Container.get(SongsService).getAll();
  const maxAllowedValue = songsList.length;

  if (Number.isNaN(amount) || (amount < 1 || amount > maxAllowedValue)) {
    throw new Error(`Nieprawidłowa liczba utworów ${command.rawArgs}, podaj liczbę z zakresu 1-${maxAllowedValue}`);
  }

  const songs = songsList.randomShuffle().slice(0, amount);

  const songsToQueue = await filterEmbeddableSongs(songs);

  const eventData: AddSongsToQueueEvent = { id: 'AddSongsToQueueEvent', songs: songsToQueue };
  Container.get(PlayerEventStream).sendToEveryone(eventData);

  songsToQueue.forEach((song) => {
    Container.get(SongsService).incrementPlayCount(song.youtubeId, song.name);
  });
  const text = buildMessage(songsToQueue);

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
