import { Request, Response } from 'express';
import CommandService from '../services/CommandService';

const FAIL_GIF_URL = 'https://media.giphy.com/media/11StaZ9Lj74oCY/giphy.gif';

function getHipchatMessage(message: string) {
  return {
    message,
    color: 'green',
    notify: false,
    message_format: 'text',
  };
}

function postCommand(req: Request, res: Response) {
  const text = req.body.item.message.message;

  CommandService.executeCommand(text)
    .then(responseMessage => getHipchatMessage(responseMessage))
    .then((hipchatMessage) => {
      if (hipchatMessage.message === '') {
        res.sendStatus(200);
      }
      res.send(hipchatMessage);
    })
    .catch((err) => {
      res.send(getHipchatMessage(`Ups, coś poszło nie tak\n${FAIL_GIF_URL}`));
      console.error(err);
    });
}

export default {
  postCommand,
};
