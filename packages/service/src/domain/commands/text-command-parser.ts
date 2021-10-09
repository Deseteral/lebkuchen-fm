import { Service } from 'typedi';
import Configuration from '../../infrastructure/configuration';
import Command from './model/command';

@Service()
class TextCommandParser {
  constructor(private configuration: Configuration) { }

  public parseTextToCommand(text: string): (Command | null) {
    const tokens = text.split(' ')
      .map((s) => s.trim())
      .filter((s) => (s.length > 0));

    if (tokens.length < 2) return null;

    const prompt = tokens[0];
    const key = tokens[1];

    if (prompt !== this.configuration.COMMAND_PROMPT) return null;

    const rawArgsIndex = (text.indexOf(key) + key.length + 1);
    const rawArgs = text.substring(rawArgsIndex);

    return new Command(key, rawArgs);
  }
}

export default TextCommandParser;
