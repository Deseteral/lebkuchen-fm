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

function handleSearch(tokens: string[]) : (Command | null) {
  if (requireMinLength(3, tokens)) return null;

  const query = tokens.slice(2).join(' ');

  return {
    type: CommandType.Search,
    arguments: { query },
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

function handleList(tokens: string[]) : (Command | null) {
  if (requireMinLength(2, tokens)) return null;

  return {
    type: CommandType.List,
    arguments: null,
  };
}

function handleX(tokens: string[]) : (Command | null) {
  if (requireMinLength(3, tokens)) return null;

  return {
    type: CommandType.X,
    arguments: { sound: tokens[2] },
  };
}

function handleRandom(tokens: string[]) : (Command | null) {
  if (requireMinLength(2, tokens)) return null;

  const count = parseInt(tokens[2], 10) || 1;

  return {
    type: CommandType.Random,
    arguments: { count },
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
    case 'list': return handleList(tokens);
    case 'x': return handleX(tokens);
    case 'search': return handleSearch(tokens);
    case 'random': return handleRandom(tokens);
    default:
      return null;
  }
}

export default {
  parse,
};
