import * as CommandExecutorService from '../commands/command-executor-service';
import MessageBlock from '../commands/message-block';
import SlackBlock, { SectionSlackBlock } from './slack-block';

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

      case 'PLAIN_TEXT':
        if (blocks.length === 0 || !((blocks.last() as SectionSlackBlock).fields)) {
          blocks.push({ type: 'section', fields: [] });
        }

        (blocks.last() as SectionSlackBlock).fields?.push({
          type: 'plain_text',
          text: message.text,
          emoji: true,
        });
        break;

      default: break;
    }
  });

  return blocks;
}

async function processSlackCommand(command: string, text: string): Promise<SlackBlock[]> {
  const messageContent = `${command} ${text}`;
  const commandProcessingResponse = await CommandExecutorService.processFromText(messageContent);
  return mapMessagesToSlackBlocks(commandProcessingResponse);
}

export {
  processSlackCommand,
};
