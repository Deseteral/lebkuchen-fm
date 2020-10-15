import fetch from 'node-fetch';
import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';

async function xCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  if (command.rawArgs === '') {
    throw new Error('Podaj nazwę spółki');
  }
  const res = await fetch(`https://www.bankier.pl/inwestowanie/profile/quote.html?symbol=${command.rawArgs}`);
  const data = await res.text();
  const divVithPrice = '<div class="profilLast">';
  const indexOfDivVithPrice = data.indexOf(divVithPrice);

  if (indexOfDivVithPrice < 0) {
    throw new Error(`Nie znaleziono ceny dla spółki ${command.rawArgs}`);
  }
  const priceBeginningIndex = indexOfDivVithPrice + divVithPrice.length;
  const priceLength = data.indexOf('</div>', priceBeginningIndex) - priceBeginningIndex;

  const price = data.substr(priceBeginningIndex, priceLength);

  const spanWithChange = '<span class="value">';
  const changeDivBeginningIndex = data.indexOf(spanWithChange, priceBeginningIndex) + spanWithChange.length;
  const changeLength = data.indexOf('</span>', changeDivBeginningIndex) - changeDivBeginningIndex;
  const change = data.substr(changeDivBeginningIndex, changeLength);

  const emoji = change.startsWith('-') ? ':chart_with_downwards_trend:' : ':chart_with_upwards_trend:';

  return makeSingleTextProcessingResponse(`Cena: ${price}, zmiana: ${change} ${emoji}`, false);
}

const xCommandDefinition: CommandDefinition = {
  key: 'stock',
  processor: xCommandProcessor,
  helpMessage: 'Sprawdza kurs akcji firmy notowanej na GPW (z 15 minutowym opóźnieniem)',
  helpUsages: [
    '<company name>',
    'alior',
    'allegro',
    'mbank',
  ],
};

export default xCommandDefinition;
