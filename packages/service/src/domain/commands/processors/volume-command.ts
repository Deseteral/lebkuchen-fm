import { ChangeVolumeEvent } from '../../../event-stream/model/events';
import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import * as EventStreamService from '../../../event-stream/event-stream-service';

async function volumeCommandProcessor(command: Command) : Promise<CommandProcessingResponse> {
  const value = command.rawArgs;

  const isRelativeChange = (value.startsWith('+') || value.startsWith('-'));
  const parsedVolume = parseInt(value, 10);

  if (Number.isNaN(parsedVolume)) {
    throw new Error(`Nieprawidłowa głośność "${value}". Aby zmienić głośność podaj liczbę ze znakiem z przedziału [-100,+100] lub bez znaku z przedziału [0,100]`);
  }
  if (isRelativeChange && (parsedVolume < -100 || parsedVolume > 100)) {
    throw new Error(`Nieprawidłowa głośność względna "${value}", podaj liczbę (ze znakiem) z przedziału [-100,+100]`);
  }
  if (!isRelativeChange && (parsedVolume < 0 || parsedVolume > 100)) {
    throw new Error(`Nieprawidłowa głośność bezwzględna "${value}", podaj liczbę (bez znaku) z przedziału [0,100]`);
  }

  const event: ChangeVolumeEvent = {
    id: 'ChangeVolumeEvent',
    isRelative: isRelativeChange,
    nextVolume: parsedVolume,
  };
  EventStreamService.sendToEveryone(event);

  if (isRelativeChange) {
    return makeSingleTextProcessingResponse(`Zmieniono głośność o "${value}"`, false);
  }
  return makeSingleTextProcessingResponse(`Ustawiono głośność na "${value}"`, false);
}

const volumeCommandDefinition: CommandDefinition = {
  key: 'volume',
  shortKey: 'vol',
  processor: volumeCommandProcessor,
  helpMessage: 'Ustawia głośność na zadaną z zakresu [0,100] lub zmienia głośność o zadaną wartość z zakresu [-100,+100]',
  helpUsages: [
    '<volume from 1 to 100>',
    '<relative volume change from -100 to 100>',
    '55',
    '0',
    '+10',
    '-10',
  ],
};

export default volumeCommandDefinition;
