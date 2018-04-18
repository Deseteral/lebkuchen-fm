import Command, { CommandType } from '../domain/Command';
import TrimTimeParser from './TrimTimeParser';

//      /fm add id|name|trim-start|trim-end
//      /fm queue id
//      /fm queue name
//      /fm skip

const PROMPT = '/fm';

function handleAdd(tokens: string[]) : (Command | null) {
  const songDetails = tokens
    .slice(2)
    .join(' ')
    .split('|')
    .map(s => s.trim());

  if (requireMinLength(2, songDetails)) return null;

  const id = songDetails[0];
  const name = songDetails[1];
  const trimStartSeconds = songDetails[2]
    ? TrimTimeParser.parseToSeconds(songDetails[2])
    : null;
  const trimEndSeconds = songDetails[3]
    ? TrimTimeParser.parseToSeconds(songDetails[3])
    : null;

  return {
    type: CommandType.Add,
    arguments: { id, name, trimStartSeconds, trimEndSeconds },
  };
}

function handleQueue(tokens: string[]) : (Command | null) {
  if (requireMinLength(3, tokens)) return null;

  const id = tokens.slice(2).join(' ');

  return {
    type: CommandType.Queue,
    arguments: { id },
  };
}

function handleSkip(tokens: string[]) : (Command | null) {
  return {
    type: CommandType.Skip,
    arguments: null,
  };
}

function handleSay(tokens: string[]) : (Command | null) {
  if (requireMinLength(3, tokens)) return null;

  const text = tokens.slice(2).join(' ');

  return {
    type: CommandType.Say,
    arguments: { text },
  };
}

function requireMinLength(minLength: number, tokens: string[]) : boolean {
  return (tokens.length < minLength);
}

function parse(text: String) : (Command | null) {
  const tokens = text
    .split(' ')
    .filter(s => s !== '')
    .map(s => s.trim());

  if (tokens[0] !== PROMPT) return null;
  if (requireMinLength(2, tokens)) return null;

  const command = tokens[1];

  switch (command) {
    case 'add': return handleAdd(tokens);
    case 'queue': return handleQueue(tokens);
    case 'skip': return handleSkip(tokens);
    case 'say': return handleSay(tokens);
    default:
      return null;
  }
}

export default {
  parse,
};
