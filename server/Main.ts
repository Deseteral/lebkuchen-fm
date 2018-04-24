import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import HipChatController from './controllers/HipChatController';
import MongoConnection from './clients/MongoConnection';
import IoConnection from './clients/IoConnection';
import XController from './controllers/XController';
import CommandInitializer from './commands/registry/CommandInitializer';

let app: (express.Express | null) = null;
let server: (http.Server | null) = null;

function configureExpress() {
  app = express();
  app.set('port', (process.env.PORT || 9000));
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
}

function registerControllers() {
  if (!app) return;
  app.post('/commands/hipchat', HipChatController.postCommand);
  app.get('/xsounds', XController.getSounds);
}

function configureServer() {
  if (!app) return;
  server = new http.Server(app);
}

function runApplication() {
  if (!app || !server) return;
  const port = app.get('port');
  const env = app.get('env');
  server.listen(
    port,
    () => console.log(`LebkuchenFM running on port ${port} in ${env} mode`),
  );
}

Promise.resolve()
  .then(() => MongoConnection.connect())
  .then(() => CommandInitializer.initialize())
  .then(() => configureExpress())
  .then(() => registerControllers())
  .then(() => configureServer())
  .then(() => IoConnection.connect(server as http.Server))
  .then(() => runApplication())
  .catch(err => console.error(err));
