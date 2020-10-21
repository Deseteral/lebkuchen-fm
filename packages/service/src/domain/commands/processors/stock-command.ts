import fetch from 'node-fetch';
import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';

async function stockCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  if (command.rawArgs === '') {
    throw new Error('Podaj nazwę spółki');
  }
  const res = await fetch(`https://www.bankier.pl/inwestowanie/profile/quote.html?symbol=${command.rawArgs}`);
  const data = await res.text();

  const matchResulet = data.match('<div class="profilLast">(.*)</div>\\s*<div class="change (up|down)">\\s*<span class="value">(.*)</span>\\s*<span class="value">(.*)</span>');
  if (!matchResulet) {
    throw new Error(`Nie znaleziono ceny dla spółki ${command.rawArgs}`);
  }
  const price = matchResulet[1];
  const change = matchResulet[2];
  const changePercentage = matchResulet[3];
  const changeValue = matchResulet[4];

  const emoji = change === 'down' ? ':chart_with_downwards_trend:' : ':chart_with_upwards_trend:';

  return makeSingleTextProcessingResponse(`Cena: ${price}, zmiana: ${changePercentage} (${changeValue}) ${emoji}`, false);
}

const stockCommandDefinition: CommandDefinition = {
  key: 'stock',
  processor: stockCommandProcessor,
  helpMessage: 'Sprawdza kurs akcji firmy notowanej na GPW (z 15 minutowym opóźnieniem)',
  helpUsages: [
    '<company name>',
    'alior',
    'allegro',
    'mbank',
  ],
};

export default stockCommandDefinition;
