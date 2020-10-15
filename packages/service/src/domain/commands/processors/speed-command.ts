import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as EventStreamService from '../../../event-stream/event-stream-service';
import { SpeedEvent } from '../../../event-stream/model/events';
import Command from '../model/command';

async function speedCommandProcessor(command: Command) : Promise<CommandProcessingResponse> {
  const arg = command.rawArgs;
  let newSpeed = 0;
  let message = 'normalną';

  switch (arg) {
    case '--':
      newSpeed = -1;
      message = 'mniejszą';
      break;
    case '++':
      newSpeed = 1;
      message = 'większą';
      break;
    case '1':
      break;
    default:
      throw new Error('Speed przyjmuje argumenty "--", "++" oraz "1"');
  }

  const event: SpeedEvent = { id: 'SpeedEvent', nextSpeed: newSpeed };
  EventStreamService.sendToEveryone(event);
  return makeSingleTextProcessingResponse(`Lecimy z ${message} prędkością!`, false);
}

const speedCommandDefinition: CommandDefinition = {
  key: 'speed',
  processor: speedCommandProcessor,
  helpMessage: 'Zmienia prędkość odtwarzania',
  helpUsages: [
    '--',
    '++',
    '1 (resetuje)',
  ],
};

export default speedCommandDefinition;
