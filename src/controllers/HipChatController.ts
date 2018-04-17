import { Request, Response } from 'express';
import CommandParser from '../services/CommandParser';

/*
 * POST /commands/hipchat
 */
function postCommand(req: Request, res: Response) {
  const { body } = req;
  const text = body.item.message.message;
  const command = CommandParser.parse(text);

  const message = command === null
    ? '/giphy fail'
    : JSON.stringify(command);

  const hipchatMessage = {
    message,
    color: 'green',
    notify: false,
    message_format: 'text',
  };

  res.send(hipchatMessage);
}

export default {
  postCommand,
};
