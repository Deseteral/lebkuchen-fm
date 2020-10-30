import SongsService from '../../songs/songs-service';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import Command from '../model/command';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import CommandDefinition from '../model/command-definition';
import { AddSongsToQueueEvent } from '../../../event-stream/model/events';

const DAYILY_LIMIT_QUEUE_NEXT = 3;

let countQueueNext = 0;
let dayOfLastUsingQueueNext = new Date();

function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
  date.getMonth() === today.getMonth() &&
  date.getFullYear() === today.getFullYear();
}

function checkDailyLimitQueueNextExceeded() : boolean {
  if (isToday(dayOfLastUsingQueueNext) && countQueueNext >= DAYILY_LIMIT_QUEUE_NEXT) {
    return true;
  }
  if (!isToday(dayOfLastUsingQueueNext)) {
    dayOfLastUsingQueueNext = new Date();
    countQueueNext = 0;
  }
  countQueueNext += 1;
  return false;
}

async function queueCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const commandArgs = command.getArgsByDelimiter(' ');
  const atTheBeginning = (commandArgs.length > 1 && commandArgs[0] === '-n');
  const songName = atTheBeginning ? commandArgs[1] : commandArgs[0];

  if (atTheBeginning && checkDailyLimitQueueNextExceeded()) {
    throw Error('Sorry Batory, ale dzienny limit wrzucania na początek został osiągnięty. Poczekaj cierpliwie do jutra');
  }

  const song = await SongsService.instance.getSongByNameWithYouTubeIdFallback(songName);
  const eventData: AddSongsToQueueEvent = { id: 'AddSongsToQueueEvent', songs: [song], atTheBeginning };

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
  ].join('\n'),
  helpUsages: [
    '[option] <video name or youtube-id>',
    'transatlantik',
    'p28K7Fz0KrQ',
    '-n p28K7Fz0KrQ',
  ],
};

export default queueCommandDefinition;
