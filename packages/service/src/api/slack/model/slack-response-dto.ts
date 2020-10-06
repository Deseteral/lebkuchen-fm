import CommandProcessingResponse from '../../../domain/commands/command-processing-response';
import SlackBlock, { mapMessagesToSlackBlocks } from './slack-block';

type SlackResponseType = ('ephemeral' | 'in_channel');

interface SlackBlockResponseDto {
  response_type: SlackResponseType, // eslint-disable-line camelcase
  blocks: SlackBlock[],
}

interface SlackSimpleResponseDto {
  response_type: SlackResponseType, // eslint-disable-line camelcase
  text: string,
}

function makeSlackSimpleResponse(text: string, visibleToSenderOnly: boolean)
: SlackSimpleResponseDto {
  return {
    response_type: visibleToSenderOnly ? 'ephemeral' : 'in_channel',
    text,
  };
}

function mapCommandProcessingResponseToSlackResponse(processingResponse: CommandProcessingResponse)
: SlackBlockResponseDto {
  return {
    response_type: processingResponse.isVisibleToIssuerOnly ? 'ephemeral' : 'in_channel',
    blocks: mapMessagesToSlackBlocks(processingResponse.messages),
  };
}

export {
  SlackResponseType,
  SlackBlockResponseDto,
  SlackSimpleResponseDto,
  makeSlackSimpleResponse,
  mapCommandProcessingResponseToSlackResponse,
};
