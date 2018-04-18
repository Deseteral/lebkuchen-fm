import { Request, Response } from 'express';
import CommandParser from '../services/CommandParser';
import CommandExecuter from '../services/CommandExecuter';

const FAIL_GIF_URL = 'https://media.giphy.com/media/11StaZ9Lj74oCY/giphy.gif';

/*
 * POST /commands/hipchat
 */
function postCommand(req: Request, res: Response) {
  const text = req.body.item.message.message;
  const command = CommandParser.parse(text);

  const responseMessage = !!command
    ? CommandExecuter.execute(command)
    : FAIL_GIF_URL;

  if (responseMessage !== '') {
    const hipchatMessage = {
      message: responseMessage,
      color: 'green',
      notify: false,
      message_format: 'text',
    };

    res.send(hipchatMessage);
  } else {
    res.status(200).end();
  }
}

export default {
  postCommand,
};
