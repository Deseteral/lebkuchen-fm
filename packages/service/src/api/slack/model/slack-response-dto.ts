import { SlackBlock, mapMessagesToSlackBlocks } from '@service/api/slack/model/slack-block';
import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';

export type SlackResponseType = ('ephemeral' | 'in_channel');

export interface SlackBlockResponseDto {
  response_type: SlackResponseType, // eslint-disable-line camelcase
  blocks: SlackBlock[],
}

export interface SlackSimpleResponseDto {
  response_type: SlackResponseType, // eslint-disable-line camelcase
  text: string,
}

export function makeSlackSimpleResponse(text: string, visibleToSenderOnly: boolean): SlackSimpleResponseDto {
  return {
    response_type: visibleToSenderOnly ? 'ephemeral' : 'in_channel',
    text,
  };
}

export function mapCommandProcessingResponseToSlackResponse(processingResponse: CommandProcessingResponse): SlackBlockResponseDto {
  return {
    response_type: processingResponse.isVisibleToIssuerOnly ? 'ephemeral' : 'in_channel',
    blocks: mapMessagesToSlackBlocks(processingResponse.messages),
  };
}
