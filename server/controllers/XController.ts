import { Request, Response } from 'express';
import XRepository from '../repositories/XRepository';

/*
 * POST /commands/hipchat
 */
function getSounds(req: Request, res: Response) {
  XRepository.getAll().then((sounds) => {
    res.send(sounds);
  });
}

export default {
  getSounds,
};
