enum CommandType {
  Add = 'ADD',
  Queue = 'QUEUE',
  Skip = 'SKIP',
  Say = 'SAY',
  List = 'LIST',
  X = 'X',
  Search = 'SEARCH',
  Random = 'RANDOM',
  Help = 'HELP'
}

interface AddArgument {
  id: string;
  name: string;
  trimStartSeconds: number | null;
  trimEndSeconds: number | null;
}

interface HelpArgument {
  topic: string;
}

interface QueueArgument {
  id: string;
}

interface SayArgument {
  text: string;
}

interface XArgument {
  sound: string;
}

interface SearchArgument {
  query: string;
}

interface RandomArgument {
  count: number;
}

interface Command {
  type: CommandType;
  arguments: null | AddArgument | QueueArgument | SayArgument | XArgument | SearchArgument | HelpArgument
  | RandomArgument;
}

export default Command;
export { CommandType,
  AddArgument, QueueArgument, SayArgument, XArgument, SearchArgument, RandomArgument, HelpArgument };
