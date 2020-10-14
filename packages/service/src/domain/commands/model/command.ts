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
      .map((s) => s.trim())
      .filter((s) => (s.length > 0));
  }
}

export default Command;
