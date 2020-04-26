import express from 'express';
import signale from 'signale';
import expressWs from 'express-ws';

import { eventsController } from './events-controller';
import { inspectController } from './inspect-controller';

signale.config({ displayTimestamp: true });

const app = express() as unknown as expressWs.Application;
expressWs(app);
const port = 3000;

// TODO: Compression
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/inspect', inspectController);
app.ws('/events', eventsController);

app.listen(port, () => signale.info(`LebkuchenFM service started on port ${port}`));
