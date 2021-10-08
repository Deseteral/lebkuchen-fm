import { Service } from 'typedi';
import Command from '../model/command';
import CommandProcessingResponse from '../model/command-processing-response';
import SongsService from '../../songs/songs-service';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import { AddSongsToQueueEvent } from '../../../event-stream/model/events';
import YouTubeDataClient from '../../../youtube/youtube-data-client';
import Song from '../../songs/song';
import CommandProcessor from '../model/command-processor';
import RegisterCommand from '../registry/register-command';

const MAX_TITLES_IN_MESSAGE = 10;

@RegisterCommand
@Service()
class RandomCommand extends CommandProcessor {
  constructor(private songService: SongsService, private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const amount = (command.rawArgs === '')
      ? 1
      : parseInt(command.rawArgs, 10);

    const songsList = await this.songService.getAll();
    const maxAllowedValue = songsList.length;

    if (Number.isNaN(amount) || (amount < 1 || amount > maxAllowedValue)) {
      throw new Error(`Nieprawidłowa liczba utworów ${command.rawArgs}, podaj liczbę z zakresu 1-${maxAllowedValue}`);
    }

    const songs = songsList.randomShuffle().slice(0, amount);

    const songsToQueue = await this.filterEmbeddableSongs(songs);

    const eventData: AddSongsToQueueEvent = { id: 'AddSongsToQueueEvent', songs: songsToQueue };
    this.playerEventStream.sendToEveryone(eventData);

    songsToQueue.forEach((song) => {
      this.songService.incrementPlayCount(song.youtubeId, song.name);
    });
    const text = this.buildMessage(songsToQueue);

    return {
      messages: [{
        text,
        type: 'MARKDOWN',
      }],
      isVisibleToIssuerOnly: false,
    };
  }

  private async filterEmbeddableSongs(songs: Song[]): Promise<Song[]> {
    const youtubeIds = songs.map((song) => song.youtubeId);
    const statuses = await YouTubeDataClient.fetchVideosStatuses(youtubeIds);
    const idToEmbeddable: Map<string, boolean> = new Map(statuses.items.map((status) => [status.id, status.status.embeddable]));

    return songs.filter((song) => idToEmbeddable.get(song.youtubeId));
  }

  private buildMessage(songsToQueue: Song[]): string {
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

  get key(): string {
    return 'random';
  }

  get shortKey(): string | null {
    return null;
  }

  get helpMessage(): string {
    return 'Losuje utwory z historii';
  }

  get helpUsages(): string[] | null {
    return [
      '[amount; defaults to 1]',
      '3',
    ];
  }
}

export default RandomCommand;
