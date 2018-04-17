import { Request, Response } from 'express';
import CommandParser from '../services/CommandParser';

/*
 * POST /commands/hipchat
 */
function postCommand(req: Request, res: Response) {
  const { body } = req;
  const message = body.item.message.message;
  const command = CommandParser.parse(message);

  console.log(command);

  const responseMessage = {
    color: 'green',
    message: JSON.stringify(command),
    notify: false,
    message_format: 'text',
  };

  res.send(responseMessage);
}

export default {
  postCommand,
};
