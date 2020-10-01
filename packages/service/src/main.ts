import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import * as Configuration from './application/configuration';
import * as Logger from './application/logger';

const app: express.Express = express();
const server: http.Server = new http.Server(app);

function configureExpress() {
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
}

function runApplication() {
  const port = Configuration.read().PORT;
  server.listen(port, () => Logger.info(`LebkuchenFM service started on port ${port}`));
}

Promise.resolve()
  .then(configureExpress)
  .then(runApplication)
  .catch((err) => Logger.error(err, 'app-init'));
