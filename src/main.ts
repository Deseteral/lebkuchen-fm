import express from 'express';
import signale from 'signale';

signale.config({ displayTimestamp: true });

const app = express();
const port = 3000;

// TODO: Compression
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => signale.info(`LebkuchenFM service started on port ${port}`));
