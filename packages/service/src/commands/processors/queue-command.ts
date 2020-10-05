import * as SongService from '../../songs/song-service';
import * as EventStreamService from '../../event-stream/event-stream-service';
import Command from '../command';
import CommandProcessingResponse, { makeSingleTextMessage } from '../command-processing-response';
import CommandDefinition from '../registry/command-definition';
import { AddSongToQueueRequestEvent } from '../../event-stream/events';

async function queueCommandProcessor(command: Command) : Promise<CommandProcessingResponse> {
  const songName = command.rawArgs;
  const song = await SongService.getSongByNameWithYouTubeIdFallback(songName);

  const eventData: AddSongToQueueRequestEvent = { id: 'AddSongToQueueRequestEvent', song };
  EventStreamService.broadcast(eventData);

  SongService.incrementPlayCount(song.youtubeId, song.name);

  return {
    messages: makeSingleTextMessage(`Dodano "${song.name}" do kolejki`),
    isVisibleToIssuerOnly: false,
  };
}

const queueCommandDefinition: CommandDefinition = {
  key: 'queue',
  shortKey: 'q',
  processor: queueCommandProcessor,
  helpMessage: 'Dodaje do kolejki utwór z bazy, a jeżeli go tam nie ma trakuje frazę jako YouTube ID',
};

export default queueCommandDefinition;
