import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import Configuration from './infrastructure/configuration';
import Logger from './infrastructure/logger';
import Storage from './infrastructure/storage';
import * as CommandInitializer from './domain/commands/registry/command-initializer';
import * as EventStream from './event-stream/event-stream';

import SlackCommandController from './api/slack/slack-command-controller';
import TextCommandController from './api/text/text-command-controller';
import XSoundsController from './domain/x-sounds/x-sounds-controller';
import SongsController from './domain/songs/songs-controller';

import './polyfills';

const app: express.Express = express();
const server: http.Server = new http.Server(app);
const logger = new Logger('app-init');

function configureExpress(): void {
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
}

function setupRouting(): void {
  app.use('/commands/slack', SlackCommandController);
  app.use('/commands/text', TextCommandController);
  app.use('/x-sounds', XSoundsController);
  app.use('/songs', SongsController);
}

function runApplication(): void {
  const port = Configuration.PORT;
  server.listen(port, () => logger.info(`LebkuchenFM service started on port ${port}`));
}

Promise.resolve()
  .then(() => Storage.instance.connect())
  .then(() => CommandInitializer.initialize())
  .then(() => EventStream.initialize(server))
  .then(configureExpress)
  .then(setupRouting)
  .then(runApplication)
  .catch((err) => logger.withError(err));
