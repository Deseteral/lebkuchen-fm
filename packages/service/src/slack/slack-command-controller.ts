/* eslint-disable prefer-arrow-callback */
import express from 'express';
import * as SlackCommandService from './slack-command-service';
import * as Configuration from '../application/configuration';
import SlackBlock from './slack-block';

const router = express.Router();

interface SlackBlockResponse {
  blocks: SlackBlock[],
}

interface SlackSimpleResponse {
  response_type: ('ephemeral' | 'in_channel'), // eslint-disable-line camelcase
  text: string,
}

function makeSimpleResponse(text: string, visibleToSenderOnly: boolean): SlackSimpleResponse {
  return {
    response_type: visibleToSenderOnly ? 'ephemeral' : 'in_channel',
    text,
  };
}

router.post('/', async function processSlackCommand(req, res) {
  const isValidChannelId = (req.body.channel_id === Configuration.read().SLACK_CHANNEL_ID);
  if (!isValidChannelId) {
    res.send(makeSimpleResponse('Tej komendy można używać tylko na dedykowanym kanale', true));
  }

  const { command, text } = req.body;
  const blocks = await SlackCommandService.processSlackCommand(command, text);

  const response: SlackBlockResponse = { blocks };
  res.send(response);
});

export default router;
