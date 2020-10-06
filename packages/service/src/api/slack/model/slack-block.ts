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
  text?: SlackText,
  fields?: SlackText[],
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

export default SlackBlock;
export {
  DividerSlackBlock,
  SectionSlackBlock,
  SlackPlainText,
  SlackMarkdownText,
  mapMessagesToSlackBlocks,
};
