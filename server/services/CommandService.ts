import CommandRegistry from '../commands/registry/CommandRegistry';

const PROMPT = '/fm';

function requireMinLength(minLength: number, tokens: string[]) : boolean {
  return (tokens.length < minLength);
}

function executeCommand(textCommand: string) : Promise<string> {
  return new Promise((resolve, reject) => {
    const tokens = textCommand
      .split(' ')
      .filter(s => s !== '')
      .map(s => s.trim());

    if (tokens[0] !== PROMPT) {
      const errorMessage = `Given text message is not a command. Expected ${PROMPT} prompt, received ${tokens[0]}`; // tslint:disable-line
      const err = new Error(errorMessage);
      reject(err);
      return;
    }

    if (requireMinLength(2, tokens)) {
      resolve('Musisz podać akcję. Użyj /fm help aby dowiedzieć się więcej.');
      return;
    }

    const command = tokens[1];
    const commandProcessor = CommandRegistry.get(command).process;

    if (!commandProcessor) {
      resolve(`Komenda ${command} nie istnieje.`);
      return;
    }

    resolve(commandProcessor(textCommand));
  });
}

export default {
  executeCommand,
};
