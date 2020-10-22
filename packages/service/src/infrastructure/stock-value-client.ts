import fetch from 'node-fetch';

class StockValueClient {
  static async find(company: string): Promise<RegExpMatchArray> {
    const result = await fetch(`https://www.bankier.pl/inwestowanie/profile/quote.html?symbol=${company}`);
    if (!result.ok) {
      throw new Error(`Nie znaleziono notowań spółki ${company}`);
    }
    const data = await result.text();

    const matchResult = data.match('<div class="profilLast">(.*)</div>\\s*<div class="change (up|down)">\\s*<span class="value">(.*)</span>\\s*<span class="value">(.*)</span>');
    if (!matchResult) {
      throw new Error(`Nie znaleziono notowania dla spółki ${company}`);
    }
    return matchResult;
  }
}

export default StockValueClient;
