import { Request, Response } from 'express';
import CommandService from '../services/CommandService';
import Configuration from '../application/Configuration';

const FAIL_GIF_URL = 'https://media.giphy.com/media/11StaZ9Lj74oCY/giphy.gif';

function getSlackMessage(message: string, visibleToSenderOnly: boolean = false) {
  return {
    text: message,
    response_type: visibleToSenderOnly ? 'ephemeral' : 'in_channel',
  };
}

function postCommand(req: Request, res: Response) {
  if (req.body.channel_name !== Configuration.CHANNEL_NAME) {
    console.log(`Message from channel ${req.body.channel_name}`);
    const errorMessage = getSlackMessage(
      'Tej komendy można używać tylko na dedykowanym kanale',
      true,
    );
    res.send(errorMessage);
    return;
  }

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
