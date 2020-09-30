import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import * as Configuration from './configuration';
import * as Logger from './logger';
import * as EventStream from './event-stream';
import * as InspectController from './inspect-controller';

const app = express();
const server = new http.Server(app);

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/inspect', InspectController.router);
EventStream.initialize(server);

const port = Configuration.get().PORT;
server.listen(port, () => Logger.get().info(`LebkuchenFM service started on port ${port}`));
