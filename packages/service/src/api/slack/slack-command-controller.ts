import { Service } from 'typedi';
import { Controller, BodyParam, Post, UseBefore } from 'routing-controllers';
import express from 'express';
import CommandExecutorService from '../../domain/commands/command-executor-service';
import Configuration from '../../infrastructure/configuration';
import Logger from '../../infrastructure/logger';
import { makeSlackSimpleResponse, mapCommandProcessingResponseToSlackResponse, SlackBlockResponseDto, SlackSimpleResponseDto } from './model/slack-response-dto';

@Service()
@Controller('/commands/slack')
class SlackCommandController {
  private static logger = new Logger('slack-command-controller');

  constructor(private commandExecutorService: CommandExecutorService, private configuration: Configuration) { }

  @Post('/')
  @UseBefore(express.urlencoded({ extended: true }))
  async processSlackCommand(
    @BodyParam('channel_id') channelId: string,
    @BodyParam('command') command: string,
    @BodyParam('text') text: string,
  ): Promise<(SlackBlockResponseDto | SlackSimpleResponseDto)> {
    const isValidChannelId = (channelId === this.configuration.SLACK_CHANNEL_ID);
    if (!isValidChannelId) {
      SlackCommandController.logger.warn('Received Slack slash command with invalid channel ID');
      return makeSlackSimpleResponse('Tej komendy można używać tylko na dedykowanym kanale', true);
    }

    const messageContent = `${command} ${text}`;

    SlackCommandController.logger.info(`Received ${messageContent} command from Slack`);

    const commandProcessingResponse = await this.commandExecutorService.processFromText(messageContent);
    return mapCommandProcessingResponseToSlackResponse(commandProcessingResponse);
  }
}

export default SlackCommandController;
