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
import memoryStore from 'memorystore';
import session from 'express-session';
import { Logger } from '@service/infrastructure/logger';
import { CommandRegistryService } from '@service/domain/commands/registry/command-registry-service';
import { AdminEventStream } from '@service/event-stream/admin-event-stream';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Configuration } from '@service/infrastructure/configuration';
import { DatabaseClient } from '@service/infrastructure/storage';
import { RequestSession } from '@service/api/request-session';
import { Action, HttpError, InternalServerError } from 'routing-controllers';
import { nanoid } from 'nanoid';
import { expressMiddlewareToSocketIoMiddleware, extractSessionFromIncomingMessage, parseAuthorizationHeader } from '@service/utils/utils';
import { AuthService } from '@service/domain/auth/auth-service';
import { DiscordClient } from '@service/discord/discord-client';

const logger = new Logger('app-init');

async function main(): Promise<void> {
  /* Read configuration */
  const config = Configuration.readFromEnv();
  Container.set(Configuration, config);

  /* Setup session middleware */
  const MemoryStore = memoryStore(session);
  const sessionMiddleware = session({
    secret: nanoid(32),
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: 24 * 60 * 60 * 1000 }),
  });

  /* Create HTTP server */
  RoutingControllers.useContainer(Container);

  const app = express();
  app.use(compression());
  app.use(sessionMiddleware);

  RoutingControllers.useExpressServer(app, {
    controllers: [path.join(__dirname, 'api/**/*-controller.js')],
    authorizationChecker: async (action: Action) => Container.get(AuthService).isRequestAuthorized(
      action.request.session,
      parseAuthorizationHeader(action.request.headers.authorization),
    ),
    currentUserChecker: async (action: Action) => Container.get(AuthService).getRequestsUser(
      action.request.session,
      parseAuthorizationHeader(action.request.headers.authorization),
    ),
    defaultErrorHandler: false,
  });

  // TODO: The error handler below and a `defaultErrorHandler=false` flag in the configuration is a fix for an issue
  // within routing-controllers. When that issue is resolved it should be possible to return to the default error handler.
  // https://github.com/typestack/routing-controllers/issues/653#issuecomment-1057906505
  app.use((error: any, _: any, res: any, __: any) => {
    if (error instanceof HttpError) {
      res.status(error.httpCode).send(error);
    } else {
      res.status(500).send(new InternalServerError('Unhandled error'));
    }
  });

  // Static files for web client frontend
  const pathToStaticFiles = path.join(__dirname, 'public');
  app.use(express.static(pathToStaticFiles, { extensions: ['html'] }));

  // For remaining (unhandled by the service) paths send client app, and let it handle that case
  app.all('*', (_: express.Request, res: express.Response) => {
    res.sendFile(path.join(pathToStaticFiles, 'index.html'), (err) => res.status(err ? 404 : 200).end());
  });

  /* Connect to database */
  const storage = Container.get(DatabaseClient);
  await storage.connect();

  /* Create WebSocket server */
  const server: http.Server = new http.Server(app);
  const io = new SocketIO.Server(server, { serveClient: false });

  const playerNamespace = io.of('/api/player');
  const adminNamespace = io.of('/api/admin');

  const ioSessionMiddleware = expressMiddlewareToSocketIoMiddleware(sessionMiddleware);
  const ioAuthorizationChecker = async (socket: SocketIO.Socket, next: Function): Promise<void | Error> => {
    const requestSession: RequestSession = extractSessionFromIncomingMessage(socket.request);
    const isSessionAuthorized: boolean = await Container.get(AuthService).isWebSocketAuthorized(requestSession);
    if (isSessionAuthorized) {
      next();
    } else {
      next(new Error('Unauthorized user'));
    }
  };

  playerNamespace.use(ioSessionMiddleware).use(ioAuthorizationChecker);
  adminNamespace.use(ioSessionMiddleware).use(ioAuthorizationChecker);

  Container.set('io-player-namespace', playerNamespace);
  Container.set('io-admin-namespace', adminNamespace);
  Container.get(PlayerEventStream);
  Container.get(AdminEventStream);

  /* Initialize commands */
  CommandRegistryService.detectProcessorModules();

  /* Connect to Discord */
  const discordClient = Container.get(DiscordClient);
  await discordClient.login();

  /* Start the server */
  server.listen(config.PORT, () => logger.info(`LebkuchenFM service started on port ${config.PORT}`));
}

try {
  main();
} catch (err) {
  logger.withError(err as Error);
}
