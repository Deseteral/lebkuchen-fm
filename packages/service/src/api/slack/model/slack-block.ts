import { MessageBlock } from '@service/domain/commands/model/command-processing-response';

export interface SlackPlainText {
  type: 'plain_text',
  text: string,
  emoji: boolean,
}

export interface SlackMarkdownText {
  type: 'mrkdwn',
  text: string,
}

export type SlackText = (SlackPlainText | SlackMarkdownText);

export interface DividerSlackBlock {
  type: 'divider',
}

export interface SectionSlackBlock {
  type: 'section',
  text: SlackText,
}

export interface HeaderSlackBlock {
  type: 'header',
  text: SlackText,
}

export interface ContextSlackBlock {
  type: 'context',
  elements: SlackPlainText[],
}

export type SlackBlock =
  | DividerSlackBlock
  | SectionSlackBlock
  | ContextSlackBlock
  | HeaderSlackBlock;

export function mapMessagesToSlackBlocks(messages: MessageBlock[]): SlackBlock[] {
  const blocks: SlackBlock[] = [];

  messages.forEach((message) => {
    switch (message.type) {
      case 'HEADER':
        blocks.push({
          type: 'header',
          text: { type: 'plain_text', text: message.text, emoji: true },
        });
        break;

      case 'PLAIN_TEXT':
        blocks.push({
          type: 'section',
          text: { type: 'plain_text', text: message.text, emoji: true },
        });
        break;

      case 'MARKDOWN':
        blocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: message.text },
        });
        break;

      case 'CONTEXT':
        blocks.push({
          type: 'context',
          elements: [{ type: 'plain_text', text: message.text, emoji: false }],
        });
        break;

      case 'DIVIDER':
        blocks.push({ type: 'divider' });
        break;

      default: break;
    }
  });

  return blocks;
}
