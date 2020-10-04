// TODO: Move away from using class
class Command {
  key: string;
  rawArgs: string;

  constructor(key: string, rawArgs: string) {
    this.key = key;
    this.rawArgs = rawArgs;
  }

  getArgsByDelimiter(delimiter: string): string[] {
    return this.rawArgs
      .split(delimiter)
      .filter((s) => (s.length > 0));
  }
}

export default Command;
