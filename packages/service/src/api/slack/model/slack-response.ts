import CommandProcessingResponse from '../../../domain/commands/command-processing-response';
import SlackBlock, { mapMessagesToSlackBlocks } from './slack-block';

type SlackResponseType = ('ephemeral' | 'in_channel');

interface SlackBlockResponse {
  response_type: SlackResponseType, // eslint-disable-line camelcase
  blocks: SlackBlock[],
}

interface SlackSimpleResponse {
  response_type: SlackResponseType, // eslint-disable-line camelcase
  text: string,
}

function makeSimpleResponse(text: string, visibleToSenderOnly: boolean): SlackSimpleResponse {
  return {
    response_type: visibleToSenderOnly ? 'ephemeral' : 'in_channel',
    text,
  };
}

function mapCommandProcessingResponseToSlackResponse(processingResponse: CommandProcessingResponse)
: SlackBlockResponse {
  return {
    response_type: processingResponse.isVisibleToIssuerOnly ? 'ephemeral' : 'in_channel',
    blocks: mapMessagesToSlackBlocks(processingResponse.messages),
  };
}

export {
  SlackResponseType,
  SlackBlockResponse,
  SlackSimpleResponse,
  makeSimpleResponse,
  mapCommandProcessingResponseToSlackResponse,
};
