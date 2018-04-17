import express from 'express';
import compression from 'compression';  // compresses requests
import bodyParser from 'body-parser';
import path from 'path';
import CommandController from './controllers/CommandController';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Controllers
app.post('/commands', CommandController.postCommand);

export default app;
