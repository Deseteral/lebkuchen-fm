/* eslint-disable import/first */
import 'reflect-metadata';
import './polyfills';

require('dotenv').config();

import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import Container from 'typedi';
import SocketIO from 'socket.io';
import * as RoutingControllers from 'routing-controllers';
import Configuration from './infrastructure/configuration';
import Logger from './infrastructure/logger';
import Storage from './infrastructure/storage';
import PlayerEventStream from './event-stream/player-event-stream';
import AdminEventStream from './event-stream/admin-event-stream';
import CommandRegistryService from './domain/commands/registry/command-registry-service';

const logger = new Logger('app-init');

async function main(): Promise<void> {
  // Read configuration
  const config = Configuration.readFromEnv();
  Container.set(Configuration, config);

  // Create server
  RoutingControllers.useContainer(Container);
  const app = RoutingControllers.createExpressServer({
    controllers: [path.join(__dirname, 'api/**/*-controller.js')],
    classTransformer: false,
  });
  const server: http.Server = new http.Server(app);

  // Configure express
  app.use(compression());
  app.use(express.static(path.join(__dirname, 'public'), { index: 'fm-player.html', extensions: ['html'] }));

  // Connect to database
  const storage = new Storage(config);
  await storage.connect();
  Container.set(Storage, storage);

  // Create WebSocket server
  const io = new SocketIO.Server(server, { serveClient: false });
  Container.set(SocketIO.Server, io);
  Container.get(PlayerEventStream);
  Container.get(AdminEventStream);

  // Initialize commands
  CommandRegistryService.detectProcessorModules();

  // Start server
  server.listen(config.PORT, () => logger.info(`LebkuchenFM service started on port ${config.PORT}`));
}

try {
  main();
} catch (err) {
  logger.withError(err as Error);
}
