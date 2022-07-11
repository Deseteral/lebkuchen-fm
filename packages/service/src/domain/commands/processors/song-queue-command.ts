import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponses } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { SongsService } from '@service/domain/songs/songs-service';
import { AddSongsToQueueEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';
import { Song } from '@service/domain/songs/song';

@RegisterCommand
@Service()
class SongQueueCommand extends CommandProcessor {
  constructor(private songService: SongsService, private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const id = command.rawArgs;
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

    embeddableSongs.forEach((song) => this.songService.incrementPlayCount(song.youtubeId, song.name));

    const songNames = embeddableSongs.map((song) => song.name).join(', ');
    return CommandProcessingResponses.markdown(`Dodano "${songNames}" do kolejki`);
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

  get helpUsages(): (string[] | null) {
    return [
      '<video name, youtube-id or youtube-playlist-id>',
      'transatlantik',
      'p28K7Fz0KrQ',
      'PLpdRVFVH_vIMvkMVdJScNK3S2SeOv7k1d',
    ];
  }
}

export { SongQueueCommand };
