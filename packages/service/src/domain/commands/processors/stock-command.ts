import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import StockValueClient from '../../../infrastructure/stock-value-client';

async function stockCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  if (command.rawArgs === '') {
    throw new Error('Podaj nazwę spółki');
  }
  const [, price, change, changePercentage, changeValue] = await StockValueClient.find(command.rawArgs);

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
