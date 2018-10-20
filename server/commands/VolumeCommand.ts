import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';
import VolumeEventMessage from "../domain/event-messages/VolumeEventMessage";

async function volume(value: string) : Promise<string> {
  const parsedInt: number = parseInt(value, 10);
  const numericValue: number = isNaN(parsedInt) ? -1 : parsedInt;

  if (numericValue < 0 || numericValue > 100) {
    return `Nieprawidłowa głośność ${value}, podaj liczbę z zakresu 0-100`;
  }

  const eventMessage: VolumeEventMessage = { volume: numericValue };

  IoConnection.broadcast('volume', eventMessage);

  return `Ustawiono głośność na "${numericValue}"`;
}

const commandDefinition: CommandDefinition = {
  key: 'volume',
  shortKey: 'vol',
  process: volume,
  helpMessage: 'Ustawia głośność na zadaną z zakresu 0-100', // tslint:disable
};

export default commandDefinition;
