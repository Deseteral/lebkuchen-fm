enum CommandType {
  Add = 'ADD',
  Queue = 'QUEUE',
  Skip = 'SKIP',
  Say = 'SAY',
  List = 'LIST',
  X = 'X',
  Search = 'SEARCH',
}

interface AddArgument {
  id: string;
  name: string;
  trimStartSeconds: number | null;
  trimEndSeconds: number | null;
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

interface Command {
  type: CommandType;
  arguments: null | AddArgument | QueueArgument | SayArgument | XArgument | SearchArgument;
}

export default Command;
export { CommandType, AddArgument, QueueArgument, SayArgument, XArgument, SearchArgument };
