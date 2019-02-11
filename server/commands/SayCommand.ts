import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';
import SayEventMessage from '../domain/event-messages/SayEventMessage';

function say(invocation: string) : Promise<string> {
  const eventMessage: SayEventMessage = {
    text: invocation,
  };

  IoConnection.broadcast('say', eventMessage);
  return Promise.resolve(`_"${invocation}"_`);
}

const commandDefinition: CommandDefinition = {
  key: 'say',
  process: say,
  helpMessage: 'Prosi spikera o odczytanie wiadomości ;)',
};

export default commandDefinition;
