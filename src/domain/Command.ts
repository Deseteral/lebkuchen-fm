enum CommandType {
  Add = 'ADD',
  Queue = 'QUEUE',
  Skip = 'SKIP',
  Say = 'SAY',
  List = 'LIST',
  X = 'X',
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

interface Command {
  type: CommandType;
  arguments: null | AddArgument | QueueArgument | SayArgument | XArgument;
}

export default Command;
export { CommandType, AddArgument, QueueArgument, SayArgument, XArgument };
