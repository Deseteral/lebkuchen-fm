import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';

function pause(parameterComponent: string) : Promise<string> {
  IoConnection.broadcast('pause', null);
  return Promise.resolve('');
}

const commandDefinition: CommandDefinition = {
  key: 'pause',
  process: pause,
  helpMessage: 'Zatrzymuje odtwarzanie bieżącego filmu',
};

export default commandDefinition;
