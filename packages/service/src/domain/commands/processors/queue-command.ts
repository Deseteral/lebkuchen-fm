import SongsService from '../../songs/songs-service';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import Command from '../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';
import { AddSongsToQueueEvent } from '../../../event-stream/model/events';

async function queueCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const songName = command.rawArgs;
  const song = await SongsService.instance.getSongByNameWithYouTubeIdFallback(songName);

  const eventData: AddSongsToQueueEvent = { id: 'AddSongsToQueueEvent', songs: [song] };
  PlayerEventStream.instance.sendToEveryone(eventData);

  SongsService.instance.incrementPlayCount(song.youtubeId, song.name);

  return makeSingleTextProcessingResponse(`Dodano "${song.name}" do kolejki`, false);
}

@CommandDefinition.register
export default class QueueCommand implements CommandDefinition {
  key = 'queue';
  shortKey = 'q';
  processor = queueCommandProcessor;
  helpMessage = 'Dodaje do kolejki utwór z bazy, a jeżeli go tam nie ma trakuje frazę jako YouTube ID';
  helpUsages = [
    '<video name or youtube-id>',
    'transatlantik',
    'p28K7Fz0KrQ',
  ];
}

export const queueCommandInstance = new QueueCommand();
