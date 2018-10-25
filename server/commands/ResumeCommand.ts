import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';

function resume(parameterComponent: string) : Promise<string> {
  IoConnection.broadcast('resume', null);
  return Promise.resolve('');
}

const commandDefinition: CommandDefinition = {
  key: 'resume',
  process: resume,
  helpMessage: 'Wznawia odtwarzanie aktualnego filmu, jeśli jest wstrzymany',
};

export default commandDefinition;
