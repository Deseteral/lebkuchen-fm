interface Command {
  key: string,
  rawArgs: string,
}

function getCommandArgsByDelimiter(command: Command, delimiter: string): string[] {
  return command.rawArgs
    .split(delimiter)
    .filter((s) => (s.length > 0));
}

export default Command;
export {
  getCommandArgsByDelimiter,
};
