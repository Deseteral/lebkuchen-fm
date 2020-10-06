import { SayEvent } from '../../../event-stream/events';
import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextMessage } from '../model/command-processing-response';
import * as EventStreamService from '../../../event-stream/event-stream-service';

async function sayCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const text = command.rawArgs;
  const eventMessage: SayEvent = {
    id: 'SayEvent',
    text,
  };

  EventStreamService.broadcast(eventMessage);

  return {
    messages: makeSingleTextMessage(`_"${text}"_`),
    isVisibleToIssuerOnly: false,
  };
}

const sayCommandDefinition: CommandDefinition = {
  key: 'say',
  processor: sayCommandProcessor,
  helpMessage: 'Prosi spikera o odczytanie wiadomości ;)',
};

export default sayCommandDefinition;
