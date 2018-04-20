import { Request, Response } from 'express';
import CommandParser from '../services/CommandParser';
import CommandExecuter from '../services/CommandExecuter';

const FAIL_GIF_URL = 'https://media.giphy.com/media/11StaZ9Lj74oCY/giphy.gif';

function getHipchatMessage(message: string) {
  return {
    message,
    color: 'green',
    notify: false,
    message_format: 'text',
  };
}

/*
 * POST /commands/hipchat
 */
function postCommand(req: Request, res: Response) {
  const text = req.body.item.message.message;
  const command = CommandParser.parse(text);

  CommandExecuter
    .execute(command)
    .then((responseMessage) => {
      if (responseMessage === '') {
        res.sendStatus(200);
        return;
      }

      const hipchatMessage = getHipchatMessage(responseMessage);
      res.send(hipchatMessage);
    })
    .catch((err) => {
      console.error(err);
      const hipchatMessage = getHipchatMessage(FAIL_GIF_URL);
      res.send(hipchatMessage);
    });
}

export default {
  postCommand,
};
