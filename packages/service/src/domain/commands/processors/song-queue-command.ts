import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { SongsService } from '@service/domain/songs/songs-service';
import { AddSongsToQueueEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';
import { Song } from '@service/domain/songs/song';
import { ExecutionContext } from '@service/domain/commands/execution-context';

@RegisterCommand
@Service()
class SongQueueCommand extends CommandProcessor {
  constructor(private songService: SongsService, private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command, context: ExecutionContext): Promise<CommandProcessingResponse> {
    const id = command.rawArgs;

    if (!id) {
      throw new Error('You have to provide video ID');
    }

    const songs: Song[] = [];
    try {
      const song = await this.songService.getSongByNameWithYouTubeIdFallback(id);
      songs.push(song);
    } catch (_) {
      try {
        const playlistSongs = await this.songService.getSongsFromPlaylist(id);
        songs.push(...playlistSongs);
      } catch (__) {
        throw new Error('Podane id nie jest identyfikatorem wideo ani playlisty');
      }
    }

    const embeddableSongs = await this.songService.filterEmbeddableSongs(songs);

    if (embeddableSongs.isEmpty()) {
      throw new Error('Brak wideo obsługiwanego przez osadzony odtwarzacz');
    }

    const eventData: AddSongsToQueueEvent = { id: 'AddSongsToQueueEvent', songs: embeddableSongs };
    this.playerEventStream.sendToEveryone(eventData);

    embeddableSongs.forEach((song) => this.songService.incrementPlayCount(song.youtubeId, song.name, context.user));

    const songNames = embeddableSongs.map((song) => song.name).join(', ');
    return new CommandProcessingResponseBuilder()
      .fromMarkdown(`Dodano "${songNames}" do kolejki`)
      .build();
  }

  get key(): string {
    return 'song-queue';
  }

  get shortKey(): (string | null) {
    return 'q';
  }

  get helpMessage(): string {
    return 'Dodaje do kolejki utwór z bazy, a jeżeli go tam nie ma traktuje frazę jako YouTube ID lub ID playlisty YouTube';
  }

  get exampleUsages(): string[] {
    return [
      'transatlantik',
      'p28K7Fz0KrQ',
      'PLpdRVFVH_vIMvkMVdJScNK3S2SeOv7k1d',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withRequiredOr('video-name', 'youtube-id', 'youtube-playlist-id')
      .build();
  }
}

export { SongQueueCommand };
