import { executeCommand } from './command-service';

export type TerminalProgram = (args: string[]) => Promise<string[]>;

async function fm(args: string[]): Promise<string[]> {
  const response = await executeCommand(args.join(' '));
  return response.split('\n');
}

async function help(): Promise<string[]> {
  const listOfCommands = Object.keys(programs).sort((a, b) => a.localeCompare(b));
  return ['Available commands:', `  ${listOfCommands.join(', ')}`];
}

export const programs: { [key: string]: TerminalProgram } = {
  fm,
  help,
};
