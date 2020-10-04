import Command from './command';
import * as TextCommandParser from './text-command-parser';
import * as CommandRegistry from './registry/command-registry';
import CommandProcessingResponse, { makeSingleTextMessage } from './command-processing-response';

function commandDoesNotExistResponse(): CommandProcessingResponse {
  return {
    messages: makeSingleTextMessage('Komenda nie istnieje'),
    isVisibleToIssuerOnly: true,
  };
}

async function processCommand(command: Command): Promise<CommandProcessingResponse> {
  const commandDefinition = CommandRegistry.getRegistry()[command.key];
  if (!commandDefinition) return commandDoesNotExistResponse();

  return commandDefinition.processor(command);
}

async function processFromText(textCommand: string): Promise<CommandProcessingResponse> {
  const command = TextCommandParser.parse(textCommand);
  if (!command) return commandDoesNotExistResponse();

  return processCommand(command);
}

export {
  processCommand,
  processFromText,
};
