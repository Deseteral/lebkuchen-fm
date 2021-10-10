import Command from '@service/domain/commands/model/command';
import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import CommandProcessor from '@service/domain/commands/model/command-processor';
import RegisterCommand from '@service/domain/commands/registry/register-command';
import Song from '@service/domain/songs/song';
import SongsService from '@service/domain/songs/songs-service';
import { AddSongsToQueueEvent } from '@service/event-stream/model/events';
import PlayerEventStream from '@service/event-stream/player-event-stream';
import YouTubeDataClient from '@service/youtube/youtube-data-client';
import { Service } from 'typedi';

const MAX_TITLES_IN_MESSAGE = 10;

@RegisterCommand
@Service()
class RandomCommand extends CommandProcessor {
  constructor(private songService: SongsService, private playerEventStream: PlayerEventStream, private youTubeDataClient: YouTubeDataClient) {
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
    const statuses = await this.youTubeDataClient.fetchVideosStatuses(youtubeIds);
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

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Losuje utwory z historii';
  }

  get helpUsages(): (string[] | null) {
    return [
      '[amount; defaults to 1]',
      '3',
    ];
  }
}

export default RandomCommand;
