import { Request, Response } from 'express';
import CommandService from '../services/CommandService';

const FAIL_GIF_URL = 'https://media.giphy.com/media/11StaZ9Lj74oCY/giphy.gif';

function getSlackMessage(message: string) {
  return {
    text: message,
    response_type: 'in_channel',
  };
}

function postCommand(req: Request, res: Response) {
  console.log(req.body);
  const text = `${req.body.command} ${req.body.text}`;

  CommandService.executeCommand(text)
    .then(responseMessage => getSlackMessage(responseMessage))
    .then((slackMessage) => {
      if (slackMessage.text === '') {
        res.status(200).end();
        return;
      }
      res.send(slackMessage);
    })
    .catch((err) => {
      res.send(getSlackMessage(`Ups, coś poszło nie tak\n${FAIL_GIF_URL}`));
      console.error(err);
    });
}

export default {
  postCommand,
};
