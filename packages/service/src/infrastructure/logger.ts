interface Log {
  datetime: Date,
  group: string,
  level: string,
  message: string,
}

class Logger {
  private assignedGroup: string;

  constructor(assignedGroup: string) {
    this.assignedGroup = assignedGroup;
  }

  private log(level: string, message: string, group?: string): void {
    const l: Log = {
      datetime: new Date(),
      group: group || this.assignedGroup,
      level,
      message,
    };

    Logger.printToConsole(l);
  }

  private static printToConsole(l: Log): void {
    const { datetime, group, level, message } = l;
    const msg = `[${datetime.toLocaleString()}] [${group}] ${level.toUpperCase()}: ${message}`;
    console.log(msg); // eslint-disable-line no-console
  }

  info(message: string, group?: string): void {
    this.log('info', message, group);
  }

  warn(message: string, group?: string): void {
    this.log('warn', message, group);
  }

  error(message: string, group?: string): void {
    this.log('error', message, group);
  }

  withError(error: Error, group?: string): void {
    console.error(error); // eslint-disable-line no-console
    this.log('error', error.message, group);
  }
}

export default Logger;
export {
  Log,
};
