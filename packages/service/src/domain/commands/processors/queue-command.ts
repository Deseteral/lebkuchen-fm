import SongsService from '../../songs/songs-service';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import Command from '../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';
import { AddSongToQueueEvent } from '../../../event-stream/model/events';

async function queueCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const commandArgs = command.getArgsByDelimiter(' ');
  let songNameIndex = 0;
  let atTheBeginning = false;

  if (commandArgs.length > 1 && commandArgs[0] === '-n') {
    songNameIndex = 1;
    atTheBeginning = true;
  }

  const songName = commandArgs[songNameIndex];
  const song = await SongsService.instance.getSongByNameWithYouTubeIdFallback(songName);
  const eventData: AddSongToQueueEvent = { id: 'AddSongToQueueEvent', song, atTheBeginning };

  PlayerEventStream.instance.sendToEveryone(eventData);
  SongsService.instance.incrementPlayCount(song.youtubeId, song.name);

  return makeSingleTextProcessingResponse(`Dodano "${song.name}" do kolejki`, false);
}

const queueCommandDefinition: CommandDefinition = {
  key: 'queue',
  shortKey: 'q',
  processor: queueCommandProcessor,
  helpMessage: [
    'Dodaje do kolejki utwór z bazy, a jeżeli go tam nie ma trakuje frazę jako YouTube ID.',
    '-n\t(next) dodaje utwór na początek kolejki',
  ].join('\n')
  'Dodaje do kolejki utwór z bazy, a jeżeli go tam nie ma trakuje frazę jako YouTube ID.\n' +
  '-n\t(next) dodaje utwór na początek kolejki',
  helpUsages: [
    '[option] <video name or youtube-id>',
    'transatlantik',
    'p28K7Fz0KrQ',
    '-n p28K7Fz0KrQ',
  ],
};

export default queueCommandDefinition;
