import { Request, Response } from 'express';
import CommandParser from '../services/CommandParser';

/*
 * POST /commands
 */
function postCommand(req: Request, res: Response) {
  const { body } = req;
  const message = body.item.message.message;
  const command = CommandParser.parse(message);

  console.log(command);

  res.status(200).end();
}

export default {
  postCommand,
};
