import { executeCommand } from '../../services/command-service';

async function fm(args: string[]) {
  const response = await executeCommand(`/fm ${args.join(' ')}`);
  return response.split('\n');
}

async function echo(args: string[]) {
  return args;
}

async function help() {
  const listOfCommands = Object.keys(programs).sort((a, b) => a.localeCompare(b));
  return [
    'Available commands:',
    `  ${listOfCommands.join(', ')}`
  ];
}

export const programs: { [key: string]: (args: string[]) => Promise<string[]> } = {
  echo,
  fm,
  help
};
