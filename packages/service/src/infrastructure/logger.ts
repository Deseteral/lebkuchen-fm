interface Log {
  datetime: Date,
  group: string,
  level: string,
  message: string,
}

function printToConsole(l: Log) {
  const { datetime, group, level, message } = l;
  const msg = `[${datetime.toLocaleString()}] [${group}] ${level.toUpperCase()}: ${message}`;
  console.log(msg); // eslint-disable-line no-console
}

const loggerHistory: Log[] = [];
function getLoggerHistory(): Log[] {
  return loggerHistory;
}

function log(level: string, message: string, group?: string) {
  const l: Log = {
    datetime: new Date(),
    group: group || 'default',
    level,
    message,
  };

  loggerHistory.push(l);
  printToConsole(l);
}

function info(message: string, group?: string) {
  log('info', message, group);
}

function warn(message: string, group?: string) {
  log('warn', message, group);
}

function error(message: string, group?: string) {
  log('error', message, group);
}

export { info, warn, error, getLoggerHistory };
