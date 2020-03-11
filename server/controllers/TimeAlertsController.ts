import { Request, Response } from 'express';
import Configuration from '../application/Configuration';

function getTimeAlerts(req: Request, res: Response) {
  res.send(Configuration.TIME_ALERTS);
}

export default {
  getTimeAlerts,
};
