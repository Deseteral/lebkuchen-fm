import http from 'http';
import path from 'path';
import express from 'express';
import * as Logger from './logger';
import * as EventStream from './event-stream';
import { inspectController } from './inspect-controller';

Logger.initialize();

const port = 3000;
const app = express();
const server = new http.Server(app);
EventStream.initialize(server);

// TODO: Compression
app.use(express.static(path.join(__dirname, 'public')));
app.get('/inspect', inspectController);

server.listen(port, () => Logger.get().info(`LebkuchenFM service started on port ${port}`));
