import { MessageBlock } from '../../../domain/commands/model/command-processing-response';

interface SlackPlainText {
  type: 'plain_text',
  text: string,
  emoji: boolean,
}

interface SlackMarkdownText {
  type: 'mrkdwn',
  text: string,
}

type SlackText = (SlackPlainText | SlackMarkdownText);

interface DividerSlackBlock {
  type: 'divider',
}

interface SectionSlackBlock {
  type: 'section',
  text: SlackText,
}

type SlackBlock =
  | DividerSlackBlock
  | SectionSlackBlock;

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
        blocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: `*${message.text}*` },
        });
        break;

      default: break;
    }
  });

  return blocks;
}

export default SlackBlock;
export {
  DividerSlackBlock,
  SectionSlackBlock,
  SlackPlainText,
  SlackMarkdownText,
  mapMessagesToSlackBlocks,
};
