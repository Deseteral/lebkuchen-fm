import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import HipChatController from './controllers/HipChatController';
import MongoConnection from './clients/MongoConnection';
import IoConnection from './clients/IoConnection';
import XController from './controllers/XController';

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
  (app as express.Express).post('/commands/hipchat', HipChatController.postCommand);
  (app as express.Express).get('/xsounds', XController.getSounds);
}

function configureServer() {
  server = new http.Server(app as express.Express);
}

function runApplication() {
  const port = (app as express.Express).get('port');
  const env = (app as express.Express).get('env');
  (server as http.Server).listen(
    port,
    () => console.log(`LebkuchenFM running on port ${port} in ${env} mode`),
  );
}

Promise.resolve()
  .then(() => MongoConnection.connect())
  .then(() => configureExpress())
  .then(() => registerControllers())
  .then(() => configureServer())
  .then(() => IoConnection.connect(server as http.Server))
  .then(() => runApplication())
  .catch(err => console.error(err));
