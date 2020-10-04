/* eslint-disable prefer-arrow-callback */
import express from 'express';
import * as SlackCommandService from './slack-command-service';
import * as Configuration from '../application/configuration';
import * as Logger from '../infrastructure/logger';
import { makeSimpleResponse } from './slack-response';

const router = express.Router();

router.post('/', async function processSlackCommand(req, res) {
  const isValidChannelId = (req.body.channel_id === Configuration.read().SLACK_CHANNEL_ID);
  if (!isValidChannelId) {
    res.send(makeSimpleResponse('Tej komendy można używać tylko na dedykowanym kanale', true));
    Logger.warn('Received Slack slash command with invalid channel ID', 'slack-command-controller');
  }

  const { command, text } = req.body;
  Logger.info(`Received ${command} ${text} command from Slack`, 'slack-command-controller');

  const response = await SlackCommandService.processSlackCommand(command, text);
  res.send(response);
});

export default router;
