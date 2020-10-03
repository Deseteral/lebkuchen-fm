interface SlackPlainText {
  type: 'plain_text',
  text: string,
  emoji: boolean
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

export default SlackBlock;
export {
  DividerSlackBlock,
  SectionSlackBlock,
  SlackPlainText,
  SlackMarkdownText,
};
