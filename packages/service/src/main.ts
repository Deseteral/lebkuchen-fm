/* eslint-disable import/first */
import 'reflect-metadata';
import '@service/utils/polyfills';

require('dotenv').config();

import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import Container from 'typedi';
import SocketIO from 'socket.io';
import * as RoutingControllers from 'routing-controllers';
import { Logger } from '@service/infrastructure/logger';
import { CommandRegistryService } from '@service/domain/commands/registry/command-registry-service';
import { AdminEventStream } from '@service/event-stream/admin-event-stream';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Configuration } from '@service/infrastructure/configuration';
import { DatabaseClient } from '@service/infrastructure/storage';
import session from 'express-session';
import { RequestSession } from '@service/api/request-session';
import { UsersService } from '@service/domain/users/users-service';
import { Action, HttpError, InternalServerError, NotFoundError } from 'routing-controllers';
// import memoryStore from 'memorystore';

// const MemoryStore = memoryStore(session);

const logger = new Logger('app-init');

async function main(): Promise<void> {
  /* Read configuration */
  const config = Configuration.readFromEnv();
  Container.set(Configuration, config);

  /* Create HTTP server */
  RoutingControllers.useContainer(Container);

  const app = express();
  app.use(compression());
  app.use(session({
    secret: 'keyboard cat', // TODO: generate this
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: false },
    // store: new MemoryStore({
    //   checkPeriod: 86400000, // TODO: prune expired entries every 24h
    // }),
  }));

  RoutingControllers.useExpressServer(app, {
    controllers: [path.join(__dirname, 'api/**/*-controller.js')],
    authorizationChecker: async (action: Action) => {
      // TODO: Extract this logic into auth service
      const requestSession: RequestSession = action.request.session;

      if (!requestSession.loggedUserName) {
        return false;
      }

      const user = await Container.get(UsersService).getByName(requestSession.loggedUserName);
      return (user !== null);
    },
    defaultErrorHandler: false, // TODO: This is a fix for https://github.com/typestack/routing-controllers/issues/653#issuecomment-1057906505
  });

  app.use((_, res) => {
    if (!res.headersSent) {
      throw new NotFoundError();
    }
  });

  app.use((error: any, _: any, res: any) => {
    if (error instanceof HttpError) {
      res.status(error.httpCode).send(error);
    } else {
      res.status(500).send(new InternalServerError('Unhandled error'));
    }
  });

  // Static files for web client frontend
  const pathToStaticFiles = path.join(__dirname, 'public');
  app.use(express.static(pathToStaticFiles, { extensions: ['html'] }));

  // For remaining unhandled by the service paths send client app, and let it handle that case
  app.all('*', (_: express.Request, res: express.Response) => {
    res.sendFile(path.join(pathToStaticFiles, 'index.html'), (err) => res.status(err ? 404 : 200).end());
  });

  /* Connect to database */
  const storage = Container.get(DatabaseClient);
  await storage.connect();

  /* Create WebSocket server */
  const server: http.Server = new http.Server(app);
  const io = new SocketIO.Server(server, { serveClient: false });
  Container.set(SocketIO.Server, io);
  Container.get(PlayerEventStream);
  Container.get(AdminEventStream);

  /* Initialize commands */
  CommandRegistryService.detectProcessorModules();

  /* Start the server */
  server.listen(config.PORT, () => logger.info(`LebkuchenFM service started on port ${config.PORT}`));
}

try {
  main();
} catch (err) {
  logger.withError(err as Error);
}
