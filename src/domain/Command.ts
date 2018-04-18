enum CommandType {
  Add = 'ADD',
  Queue = 'QUEUE',
  Skip = 'SKIP',
  Say = 'SAY',
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

interface Command {
  type: CommandType;
  arguments: null | AddArgument | QueueArgument | SayArgument;
}

export default Command;
export { CommandType, AddArgument, QueueArgument, SayArgument };
