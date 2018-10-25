import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';
import VolumeEventMessage from "../domain/event-messages/VolumeEventMessage";

const volChangeTypes: { [s: string]: string; } = {
  '+': 'increase',
  '-': 'decrease',
  default: 'setter',
};

function getVolChangeType(value: string):string {
  return volChangeTypes[value.charAt(0)] || volChangeTypes.default;
}

function getFeedbackMsg(eventMsg:VolumeEventMessage) {
  if (volChangeTypes['+'] === eventMsg.changeType) {
    return `Zwiększono głośność o "${eventMsg.volume}"`;
  }
  if (volChangeTypes['-'] === eventMsg.changeType) {
    return `Zmniejszono głośność o "${eventMsg.volume}"`;
  }
  return `Ustawiono głośność na "${eventMsg.volume}"`;
}

async function volume(value: string) : Promise<string> {
  const parsedInt: number = Math.abs(parseInt(value, 10));

  if (isNaN(parsedInt) || parsedInt > 100) {
    return `Nieprawidłowa głośność ${value}, podaj liczbę z zakresu 0-100, lub deltę +/-liczba`;
  }

  const eventMessage: VolumeEventMessage = { 
    volume: parsedInt,
    changeType: getVolChangeType(value),
  };
  IoConnection.broadcast('volume', eventMessage);

  return getFeedbackMsg(eventMessage);
}

const commandDefinition: CommandDefinition = {
  key: 'volume',
  shortKey: 'vol',
  process: volume,
  helpMessage: 'Ustawia głośność na zadaną z zakresu 0-100', // tslint:disable
};

export default commandDefinition;
