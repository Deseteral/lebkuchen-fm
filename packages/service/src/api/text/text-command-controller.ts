/* eslint-disable prefer-arrow-callback */
import express from 'express';
import Container from 'typedi';
import CommandExecutorService from '../../domain/commands/command-executor-service';
import Logger from '../../infrastructure/logger';
import { mapCommandProcessingResponseToTextCommandResponseDto } from './model/text-command-response-dto';

const router = express.Router();
const logger = new Logger('text-command-controller');

router.post('/', async function processTextCommand(req, res) {
  const { text } = req.body;

  logger.info(`Received ${text} command`);

  const commandProcessingResponse = await Container.get(CommandExecutorService).processFromText(text);
  const response = mapCommandProcessingResponseToTextCommandResponseDto(commandProcessingResponse);
  res.send(response);
});

export default router;
