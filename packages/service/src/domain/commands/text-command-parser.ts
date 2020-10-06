import Command from './model/command';
import * as Configuration from '../../application/configuration';

function parse(text: string): (Command | null) {
  const tokens = text.split(' ')
    .map((s) => s.trim())
    .filter((s) => (s.length > 0));

  if (tokens.length < 2) return null;

  const prompt = tokens[0];
  const key = tokens[1];

  if (prompt !== Configuration.read().COMMAND_PROMPT) return null;

  const rawArgsIndex = (text.indexOf(key) + (key.length) + 1);
  const rawArgs = text.substring(rawArgsIndex);

  return { key, rawArgs };
}

export {
  parse,
};
