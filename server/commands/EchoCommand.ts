import CommandDefinition from '../domain/CommandDefinition';

function echo(textCommand: string) : Promise<string> {
  return Promise.resolve(textCommand);
}

const commandDefinition: CommandDefinition = {
  key: 'echo',
  process: echo,
  helpMessage: 'Komenda echo',
};

export default commandDefinition;
