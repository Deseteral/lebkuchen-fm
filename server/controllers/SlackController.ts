import { Request, Response } from 'express';
import CommandService from '../services/CommandService';
import Configuration from '../application/Configuration';

const FAIL_GIF_URL = 'https://media.giphy.com/media/11StaZ9Lj74oCY/giphy.gif';

interface GetSlackMessageOptions {
  visibleToSenderOnly?: boolean;
  command?: string;
}

const SENDER_ONLY_MESSAGES = ['help', 'xlist', 'list'];

function getSlackMessage(message: string, options: GetSlackMessageOptions = {}) {
  const { visibleToSenderOnly, command } = options;

  if (visibleToSenderOnly !== undefined) {
    return {
      text: message,
      response_type: visibleToSenderOnly ? 'ephemeral' : 'in_channel',
    };
  }

  const responseType = SENDER_ONLY_MESSAGES.indexOf(command as string) !== -1
    ? 'ephemeral'
    : 'in_channel';

  return {
    text: message,
    response_type: responseType,
  };
}

function postCommand(req: Request, res: Response) {
  if (req.body.channel_id !== Configuration.SLACK_CHANNEL_ID) {
    const errorMessage = getSlackMessage(
      'Tej komendy można używać tylko na dedykowanym kanale',
      { visibleToSenderOnly: true },
    );
    res.send(errorMessage);
    return;
  }

  const text = `${req.body.command} ${req.body.text}`;

  CommandService.executeCommand(text)
    .then(responseMessage => getSlackMessage(responseMessage, { command: req.body.text.slice(' ')[0] }))
    .then((slackMessage) => {
      if (slackMessage.text === '') {
        res.status(200).end();
        return;
      }

      res.send(slackMessage);
    })
    .catch((err) => {
      const message = getSlackMessage(
        `Ups, coś poszło nie tak\n${FAIL_GIF_URL}`,
        { visibleToSenderOnly: true },
      );
      res.send(message);
      console.error(err);
    });
}

export default {
  postCommand,
};
