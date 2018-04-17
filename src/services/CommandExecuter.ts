import Command, { CommandType } from '../domain/Command';

function execute(command: Command) {
  switch (command.type) {
    case CommandType.Add:
      break;
    case CommandType.Queue:
      break;
    case CommandType.Skip:
      break;
  }
}

export default {
  execute,
};
