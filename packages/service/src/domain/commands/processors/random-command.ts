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
    const commandArgs = command.getArgsByDelimiter(' ');
    const { amount, keyWords } = this.amountAndKeyWordsFromArgs(commandArgs);

    const allSongs = await this.songService.getAll();
    const songContainsEverySearchedWord = (song: Song): boolean => keyWords.every((word) => song.name?.toLowerCase().includes(word.toLowerCase()));
    const songsFollowingCriteria = allSongs.filter(songContainsEverySearchedWord).randomShuffle();
    const maxAllowedValue = songsFollowingCriteria.length;

    if (amount < 1 || amount > maxAllowedValue) {
      const message = `Liczba utworów spełniających kryteria (${maxAllowedValue}) jest niezgodna z oczekiwaniami. Zmień kryteria lub ilość żądanych utworów.`;
      throw new Error(message);
    }

    const availableSongs = await this.filterEmbeddableSongs(songsFollowingCriteria);
    const songsToQueue = availableSongs.randomShuffle().slice(0, Math.min(availableSongs.length, amount));

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

  private amountAndKeyWordsFromArgs(args: string[]): {amount: number, keyWords: string[]} {
    const amountArgument = Number.parseInt(String(args[0]), 10);
    const argsCopy = Array.from(args);
    let amount = 1;
    if (Number.isInteger(amountArgument)) {
      argsCopy.shift();
      amount = amountArgument;
    }
    return { amount, keyWords: argsCopy };
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
    return 'Losuje utwory z historii. Parametry są opcjonalne.';
  }

  get helpUsages(): (string[] | null) {
    return [
      '<amount> <phrase>',
      '3',
      'britney',
      '3 britney',
      '',
    ];
  }
}

export default RandomCommand;
