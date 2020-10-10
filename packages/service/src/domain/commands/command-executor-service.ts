import Command from './model/command';
import * as TextCommandParser from './text-command-parser';
import * as CommandRegistry from './registry/command-registry';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from './model/command-processing-response';
import * as Logger from '../../infrastructure/logger';

function commandDoesNotExistResponse(): CommandProcessingResponse {
  return makeSingleTextProcessingResponse('Komenda nie istnieje', true);
}

async function processCommand(command: Command): Promise<CommandProcessingResponse> {
  const commandDefinition = CommandRegistry.getRegistry()[command.key];
  if (!commandDefinition) return commandDoesNotExistResponse();

  try {
    return await commandDefinition.processor(command);
  } catch (e) {
    Logger.error(e, 'command-executor-service');
    return makeSingleTextProcessingResponse((e as Error).message, false);
  }
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
