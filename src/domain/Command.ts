enum CommandType {
  Add = 'ADD',
  Queue = 'QUEUE',
  Skip = 'SKIP',
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

interface Command {
  type: CommandType;
  arguments: null | AddArgument | QueueArgument;
}

export default Command;
export { CommandType, AddArgument, QueueArgument };
