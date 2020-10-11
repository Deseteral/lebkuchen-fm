/* eslint-disable prefer-arrow-callback */
import express from 'express';
import * as CommandExecutorService from '../../domain/commands/command-executor-service';
import * as Logger from '../../infrastructure/logger';
import { mapCommandProcessingResponseToTextCommandResponseDto } from './model/text-command-response-dto';

const router = express.Router();

router.post('/', async function processTextCommand(req, res) {
  const { text } = req.body;

  Logger.info(`Received ${text} command`, 'text-command-controller');

  const commandProcessingResponse = await CommandExecutorService.processFromText(text);
  const response = mapCommandProcessingResponseToTextCommandResponseDto(commandProcessingResponse);
  res.send(response);
});

export default router;
