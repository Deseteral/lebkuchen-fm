import { Request, Response } from 'express';

/*
 * POST /commands
 */
function postCommand(req: Request, res: Response) {
  console.log(req.body);
  res.status(200).end();
}

export default {
  postCommand,
};
