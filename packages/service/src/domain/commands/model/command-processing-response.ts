interface HeaderMessageBlock {
  type: 'HEADER',
  text: string,
}

interface PlainTextMessageBlock {
  type: 'PLAIN_TEXT',
  text: string,
}

interface MarkdownMessageBlock {
  type: 'MARKDOWN',
  text: string,
}

interface ContextMessageBlock {
  type: 'CONTEXT',
  text: string,
}

interface DividerMessageBlock {
  type: 'DIVIDER',
}

type MessageBlock =
  | HeaderMessageBlock
  | PlainTextMessageBlock
  | MarkdownMessageBlock
  | ContextMessageBlock
  | DividerMessageBlock;

interface CommandProcessingResponse {
  messages: MessageBlock[],
  isVisibleToIssuerOnly: boolean,
}

function makeSingleTextProcessingResponse(text: string, isVisibleToIssuerOnly: boolean): CommandProcessingResponse {
  return {
    messages: [{ text, type: 'PLAIN_TEXT' }],
    isVisibleToIssuerOnly,
  };
}

export default CommandProcessingResponse;
export {
  MessageBlock,
  HeaderMessageBlock,
  PlainTextMessageBlock,
  MarkdownMessageBlock,
  ContextMessageBlock,
  DividerMessageBlock,
  makeSingleTextProcessingResponse,
};
