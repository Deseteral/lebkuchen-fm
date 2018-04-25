import CommandDefinition from '../domain/CommandDefinition';
import XSound from '../domain/XSound';
import XRepository from '../repositories/XRepository';

function parseParameter(parameterComponent: string) : XSound {
  const xDetails = parameterComponent
    .split('|')
    .map(s => s.trim());

  const name = xDetails[0];
  const url = xDetails[1];

  const xSound:XSound = {
    name,
    url,
    timesPlayed: 0,
  };

  return xSound;
}

async function add(parameterComponent: string) : Promise<string> {
  const xSound = parseParameter(parameterComponent);
  const foundSound = await XRepository.getByName(xSound.name);

  if (foundSound !== null) {
    return `Efekt o nazwie "${xSound.name}" już jest w bazie`;
  }

  XRepository.insert(xSound);
  return `Dodałem efekt "${xSound.name}" do biblioteki`;
}

const commandDefinition: CommandDefinition = {
  key: 'addx',
  process: add,
  helpMessage: 'Dodaje efekt dźwiękowy (np. addx name|url)',
};

export default commandDefinition;
