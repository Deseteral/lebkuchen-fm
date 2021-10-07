import 'reflect-metadata';
import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import Container from 'typedi';
import SocketIO from 'socket.io';
import Configuration from './infrastructure/configuration';
import Logger from './infrastructure/logger';
import Storage from './infrastructure/storage';
import * as CommandInitializer from './domain/commands/registry/command-initializer';

import SlackCommandController from './api/slack/slack-command-controller';
import TextCommandController from './api/text/text-command-controller';
import XSoundsController from './api/x-sounds/x-sounds-controller';
import SongsController from './api/songs/songs-controller';

import './polyfills';
import PlayerEventStream from './event-stream/player-event-stream';
import AdminEventStream from './event-stream/admin-event-stream';

(async function main(): Promise<void> {
  const logger = new Logger('app-init');

  try {
    // Create server
    const app: express.Express = express();
    const server: http.Server = new http.Server(app);

    // Connect to database
    const storage = new Storage();
    await storage.connect();
    Container.set(Storage, storage);

    // Initialize commands
    CommandInitializer.initialize();

    // Create WebSocket server
    const io = new SocketIO.Server(server, { serveClient: false });
    Container.set(SocketIO.Server, io);
    Container.get(PlayerEventStream);
    Container.get(AdminEventStream);

    // Configure express
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public'), { index: 'fm-player.html', extensions: ['html'] }));

    // Setup routing
    app.use('/commands/slack', SlackCommandController);
    app.use('/commands/text', TextCommandController);
    app.use('/x-sounds', XSoundsController);
    app.use('/songs', SongsController);

    // Start server
    const port = Configuration.PORT;
    server.listen(port, () => logger.info(`LebkuchenFM service started on port ${port}`));
  } catch (err) {
    logger.withError(err as Error);
  }
}());
