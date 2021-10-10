import Command from '@service/domain/commands/model/command';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import CommandProcessor from '@service/domain/commands/model/command-processor';
import RegisterCommand from '@service/domain/commands/registry/register-command';
import SongsService from '@service/domain/songs/songs-service';
import { AddSongsToQueueEvent } from '@service/event-stream/model/events';
import PlayerEventStream from '@service/event-stream/player-event-stream';
import YouTubeDataClient from '@service/youtube/youtube-data-client';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class QueueCommand extends CommandProcessor {
  constructor(private songService: SongsService, private playerEventStream: PlayerEventStream, private youTubeDataClient: YouTubeDataClient) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const songName = command.rawArgs;
    const song = await this.songService.getSongByNameWithYouTubeIdFallback(songName);

    const videoStatus = await this.youTubeDataClient.fetchVideosStatuses([song.youtubeId]);

    if (!videoStatus.items?.last().status.embeddable) {
      throw new Error('Ten plik nie jest obsługiwany przez osadzony odtwarzacz');
    }

    const eventData: AddSongsToQueueEvent = { id: 'AddSongsToQueueEvent', songs: [song] };
    this.playerEventStream.sendToEveryone(eventData);

    this.songService.incrementPlayCount(song.youtubeId, song.name);

    return makeSingleTextProcessingResponse(`Dodano "${song.name}" do kolejki`, false);
  }

  get key(): string {
    return 'queue';
  }

  get shortKey(): (string | null) {
    return 'q';
  }

  get helpMessage(): string {
    return 'Dodaje do kolejki utwór z bazy, a jeżeli go tam nie ma trakuje frazę jako YouTube ID';
  }

  get helpUsages(): (string[] | null) {
    return [
      '<video name or youtube-id>',
      'transatlantik',
      'p28K7Fz0KrQ',
    ];
  }
}

export default QueueCommand;
