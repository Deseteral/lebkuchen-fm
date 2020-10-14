import SongService from '../../songs/song-service';
import * as EventStreamService from '../../../event-stream/event-stream-service';
import Command from '../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';
import { AddSongToQueueEvent } from '../../../event-stream/events';

async function queueCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const songName = command.rawArgs;
  const song = await SongService.instance.getSongByNameWithYouTubeIdFallback(songName);

  const eventData: AddSongToQueueEvent = { id: 'AddSongToQueueEvent', song };
  EventStreamService.broadcast(eventData);

  SongService.instance.incrementPlayCount(song.youtubeId, song.name);

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
