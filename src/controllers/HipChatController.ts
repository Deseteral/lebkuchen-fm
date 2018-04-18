import { Request, Response } from 'express';
import CommandParser from '../services/CommandParser';
import CommandExecuter from '../services/CommandExecuter';
// https://media.giphy.com/media/11StaZ9Lj74oCY/giphy.gif

/*
 * POST /commands/hipchat
 */
function postCommand(req: Request, res: Response) {
  console.log(req.body);
  const text = req.body.item.message.message;

  const command = CommandParser.parse(text);
  if (!!command) {
    CommandExecuter.execute(command);
  }

  const hipchatMessage = {
    message: JSON.stringify(command),
    color: 'green',
    notify: false,
    message_format: 'text',
  };

  res.send(hipchatMessage);
}

export default {
  postCommand,
};
