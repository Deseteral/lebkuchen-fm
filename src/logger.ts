import fs from 'fs';
import path from 'path';
import util from 'util';
import pinoms from 'pino-multi-stream';

const readFile = util.promisify(fs.readFile);

const LOGS_FILE_PATH = path.join(__dirname, 'logs.txt');

const logger = pinoms({
  streams: [
    { stream: fs.createWriteStream(LOGS_FILE_PATH) },
    // @ts-ignore // TODO: Contribute to typings to fix this
    { stream: pinoms.prettyStream({ prettyPrint: { translateTime: true } }) },
  ],
});

function get() {
  return logger;
}

function getRawLogsFromFile() : Promise<string> {
  return readFile(LOGS_FILE_PATH, { encoding: 'utf8' });
}

export {
  get,
  getRawLogsFromFile,
};
