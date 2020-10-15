import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as EventStreamService from '../../../event-stream/event-stream-service';
import { SpeedEvent } from '../../../event-stream/model/events';
import Command from '../model/command';

async function speedCommandProcessor(command: Command) : Promise<CommandProcessingResponse> {
  const arg = command.rawArgs;
  let message: String;
  let event: SpeedEvent;

  switch (arg) {
    case '--':
      event = { id: 'ChangeSpeedEvent', nextSpeed: -1 };
      message = 'mniejszą';
      break;
    case '++':
      event = { id: 'ChangeSpeedEvent', nextSpeed: 1 };
      message = 'większą';
      break;
    case '1':
      event = { id: 'ChangeSpeedEvent', nextSpeed: 0 };
      message = 'normalną';
      break;
    default:
      throw new Error('Speed przyjmuje argumenty "--", "++" oraz "1"');
  }

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
