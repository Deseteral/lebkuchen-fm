import fs from 'fs';
import path from 'path';
import util from 'util';
import pino from 'pino';
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

async function getRawLogsFromFile() : Promise<pino.LogDescriptor[]> {
  return (await readFile(LOGS_FILE_PATH, { encoding: 'utf8' }))
    .split('\n')
    .filter((s) => (s.length > 0))
    .map((rawJson) => (JSON.parse(rawJson) as pino.LogDescriptor));
}

export {
  get,
  getRawLogsFromFile,
};
