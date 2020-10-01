import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import * as Configuration from './application/configuration';
import * as Logger from './infrastructure/logger';
import * as Storage from './infrastructure/storage';

import XSoundsController from './x-sounds/x-sounds-controller';

const app: express.Express = express();
const server: http.Server = new http.Server(app);

function configureExpress(): void {
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
}

function setupRouting(): void {
  app.use('/x-sounds', XSoundsController);
}

function runApplication(): void {
  const port = Configuration.read().PORT;
  server.listen(port, () => Logger.info(`LebkuchenFM service started on port ${port}`));
}

Promise.resolve()
  .then(() => Storage.connect())
  .then(configureExpress)
  .then(setupRouting)
  .then(runApplication)
  .catch((err) => Logger.error(err, 'app-init'));
