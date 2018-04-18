import express from 'express';
import compression from 'compression';  // compresses requests
import bodyParser from 'body-parser';
import path from 'path';
import HipChatController from './controllers/HipChatController';
import MongoConnection from './database/MongoConnection';

MongoConnection
  .connect()
  .then(() => {
    // Express configuration
    const app = express();
    app.set('port', process.env.PORT || 3000);
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public')));

    // Controllers
    app.post('/commands/hipchat', HipChatController.postCommand);

    // Start server
    app.listen(app.get('port'), () => {
      console.log(
        '  App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env'),
      );
      console.log('  Press CTRL-C to stop\n');
    });
  })
  .catch(err => console.error(err));
