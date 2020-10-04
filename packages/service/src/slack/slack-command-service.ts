import * as CommandExecutorService from '../commands/command-executor-service';
import CommandProcessingResponse, { MessageBlock } from '../commands/command-processing-response';
import SlackBlock, { SectionSlackBlock } from './slack-block';
import { SlackBlockResponse } from './slack-response';

function mapMessagesToSlackBlocks(messages: MessageBlock[]): SlackBlock[] {
  const blocks: SlackBlock[] = [];

  messages.forEach((message) => {
    switch (message.type) {
      case 'HEADER':
        blocks.push({ type: 'divider' });
        blocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: `*${message.text}*` },
        });
        break;

      case 'PLAIN_TEXT': {
        if (blocks.length === 0 || !((blocks.last() as SectionSlackBlock).fields)) {
          blocks.push({ type: 'section', fields: [] });
        }

        const lastBlock = (blocks.last() as SectionSlackBlock);
        lastBlock.fields?.push({
          type: 'plain_text',
          text: message.text,
          emoji: true,
        });
      } break;

      default: break;
    }
  });

  return blocks;
}

function mapProcessingResponseToSlackResponse(processingResponse: CommandProcessingResponse)
: SlackBlockResponse {
  return {
    response_type: processingResponse.isVisibleToIssuerOnly ? 'ephemeral' : 'in_channel',
    blocks: mapMessagesToSlackBlocks(processingResponse.messages),
  };
}

async function processSlackCommand(command: string, text: string): Promise<SlackBlockResponse> {
  const messageContent = `${command} ${text}`;
  const commandProcessingResponse = await CommandExecutorService.processFromText(messageContent);
  return mapProcessingResponseToSlackResponse(commandProcessingResponse);
}

export {
  processSlackCommand,
};
