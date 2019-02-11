import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';

function skip(parameterComponent: string) : Promise<string> {
  IoConnection.broadcast('skip', null);
  return Promise.resolve('Lecimy dalej!');
}

const commandDefinition: CommandDefinition = {
  key: 'skip',
  process: skip,
  helpMessage: 'Pomija aktualnie odtwarzany utwór',
};

export default commandDefinition;
