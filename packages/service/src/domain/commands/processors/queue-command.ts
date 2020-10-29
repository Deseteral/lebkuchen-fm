import SongsService from '../../songs/songs-service';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import Command from '../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';
import { AddSongsToQueueEvent } from '../../../event-stream/model/events';
import YouTubeDataClient from '../../../youtube/youtube-data-client';

async function queueCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const songName = command.rawArgs;
  const song = await SongsService.instance.getSongByNameWithYouTubeIdFallback(songName);

  const videoStatus = await YouTubeDataClient.fetchVideosStatuses([song.youtubeId]);

  if (!videoStatus.items?.last().status.embeddable) {
    throw new Error('Plik nie może zostać odtworzony w osadzonym odtwarzaczu');
  }

  const eventData: AddSongsToQueueEvent = { id: 'AddSongsToQueueEvent', songs: [song] };
  PlayerEventStream.instance.sendToEveryone(eventData);

  SongsService.instance.incrementPlayCount(song.youtubeId, song.name);

  return makeSingleTextProcessingResponse(`Dodano "${song.name}" do kolejki`, false);
}

const queueCommandDefinition: CommandDefinition = {
  key: 'queue',
  shortKey: 'q',
  processor: queueCommandProcessor,
  helpMessage: 'Dodaje do kolejki utwór z bazy, a jeżeli go tam nie ma trakuje frazę jako YouTube ID',
  helpUsages: [
    '<video name or youtube-id>',
    'transatlantik',
    'p28K7Fz0KrQ',
  ],
};

export default queueCommandDefinition;
