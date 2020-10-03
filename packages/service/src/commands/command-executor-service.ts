import Command from './command';
import * as TextCommandParser from './text-command-parser';
import * as CommandRegistry from './registry/command-registry';
import MessageBlock, { makeSingleTextMessage } from './message-block';

async function processCommand(command: Command): Promise<MessageBlock[]> {
  const commandDefinition = CommandRegistry.getRegistry()[command.key];
  if (!commandDefinition) return makeSingleTextMessage('Komenda nie istnieje');

  return commandDefinition.processor(command);
}

async function processFromText(textCommand: string): Promise<MessageBlock[]> {
  const command = TextCommandParser.parse(textCommand);
  if (!command) return makeSingleTextMessage(`Komenda ${textCommand} nie istnieje`);

  return processCommand(command);
}

export {
  processCommand,
  processFromText,
};
