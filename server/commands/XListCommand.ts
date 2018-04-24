import CommandDefinition from '../domain/CommandDefinition';
import XRepository from '../repositories/XRepository';

async function xlist(parameterComponent: string) : Promise<string> {
  const sounds = await XRepository.getAll();

  if (sounds.length === 0) {
    return 'Brak dźwięków w bazie';
  }

  const message = sounds
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(sound => `- ${sound.name}`)
    .join('\n');

  return message;
}

const commandDefinition: CommandDefinition = {
  key: 'xlist',
  process: xlist,
  helpMessage: 'Wypisuje listę czaderskich dźwięków w bazie',
};

export default commandDefinition;
