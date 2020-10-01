import http from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import * as Configuration from './application/configuration';
import * as Logger from './application/logger';

const app = express();
const server = new http.Server(app);

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

const port = Configuration.read().PORT;
server.listen(port, () => Logger.info(`LebkuchenFM service started on port ${port}`));
