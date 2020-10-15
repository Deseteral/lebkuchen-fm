import { ChangeVolumeEvent } from '../../../event-stream/model/events';
import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import PlayerEventStream from '../../../event-stream/player-event-stream';

async function volumeCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const value = command.rawArgs;
  const parsedValue = parseInt(value, 10);

  if (Number.isNaN(parsedValue) || (parsedValue < 0 || parsedValue > 100)) {
    throw new Error(`Nieprawidłowa głośność "${value}", podaj liczbę z zakresu 0-100`);
  }

  const event: ChangeVolumeEvent = {
    id: 'ChangeVolumeEvent',
    nextVolume: parsedValue,
  };
  PlayerEventStream.instance.sendToEveryone(event);

  return makeSingleTextProcessingResponse(`Ustawiono głośność na "${parsedValue}"`, false);
}

const volumeCommandDefinition: CommandDefinition = {
  key: 'volume',
  shortKey: 'vol',
  processor: volumeCommandProcessor,
  helpMessage: 'Ustawia głośność na zadaną z zakresu 0-100',
  helpUsages: [
    '<volume from 1-100>',
    '55',
  ],
};

export default volumeCommandDefinition;
