import mitt, { Emitter, Handler } from 'mitt';

interface Log {
  datetime: Date,
  group: string,
  level: string,
  message: string,
}

type LoggerEvent = void;
type LoggerEventType = (
  | 'printedLog'
);

const MAX_LOGGER_HISTORY_LENGTH = 1000;

class Logger {
  private assignedGroup: string;

  static loggerHistory: Log[] = [];
  private static readonly emitter: Emitter = mitt();

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

    Logger.loggerHistory.push(l);
    if (Logger.loggerHistory.length > MAX_LOGGER_HISTORY_LENGTH) {
      Logger.loggerHistory.shift();
    }

    Logger.emitter.emit('printedLog');
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

  static on(eventType: LoggerEventType, callback: Handler<LoggerEvent>): void {
    Logger.emitter.on<LoggerEvent>(eventType, callback);
  }
}

export {
  Logger,
  Log,
};
