import { Service } from 'typedi';
import SongsService from '../../songs/songs-service';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import Command from '../model/command';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '../model/command-processing-response';
import { AddSongsToQueueEvent } from '../../../event-stream/model/events';
import YouTubeDataClient from '../../../youtube/youtube-data-client';
import CommandProcessor from '../model/command-processor';
import RegisterCommand from '../registry/register-command';

@RegisterCommand
@Service()
class QueueCommand extends CommandProcessor {
  constructor(private songService: SongsService, private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const songName = command.rawArgs;
    const song = await this.songService.getSongByNameWithYouTubeIdFallback(songName);

    const videoStatus = await YouTubeDataClient.fetchVideosStatuses([song.youtubeId]);

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

  get shortKey(): string | null {
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
