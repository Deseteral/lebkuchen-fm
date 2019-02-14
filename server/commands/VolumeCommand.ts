import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';
import VolumeEventMessage from "../domain/event-messages/VolumeEventMessage";

function getFeedbackMessage(eventMsg:VolumeEventMessage) {
  const { volume } = eventMsg;
  switch (volume[0]) {
    case '+':
      return `Zwiększono głośność o "${volume.substring(1)}"`;
    case '-':
      return `Zmniejszono głośność o "${volume.substring(1)}"`;
    default:
      return `Ustawiono głośność na "${volume}"`;
  }
}

async function volume(value: string) : Promise<string> {
  const parsedInt: number = Math.abs(parseInt(value, 10));

  if (isNaN(parsedInt) || parsedInt > 100) {
    return `Nieprawidłowa głośność ${value}, podaj liczbę z zakresu 0-100, lub deltę +/-liczba`;
  }

  const eventMessage: VolumeEventMessage = {
    volume: value,
  };

  IoConnection.broadcast('volume', eventMessage);

  return getFeedbackMessage(eventMessage);
}

const commandDefinition: CommandDefinition = {
  key: 'volume',
  shortKey: 'vol',
  process: volume,
  helpMessage: 'Ustawia głośność na zadaną z zakresu 0-100', // tslint:disable
};

export default commandDefinition;
