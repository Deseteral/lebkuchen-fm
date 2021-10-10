export interface HeaderMessageBlock {
  type: 'HEADER',
  text: string,
}

export interface PlainTextMessageBlock {
  type: 'PLAIN_TEXT',
  text: string,
}

export interface MarkdownMessageBlock {
  type: 'MARKDOWN',
  text: string,
}

export interface ContextMessageBlock {
  type: 'CONTEXT',
  text: string,
}

export interface DividerMessageBlock {
  type: 'DIVIDER',
}

export type MessageBlock =
  | HeaderMessageBlock
  | PlainTextMessageBlock
  | MarkdownMessageBlock
  | ContextMessageBlock
  | DividerMessageBlock;

export interface CommandProcessingResponse {
  messages: MessageBlock[],
  isVisibleToIssuerOnly: boolean,
}

export function makeSingleTextProcessingResponse(text: string): CommandProcessingResponse {
  return {
    messages: [{ text, type: 'PLAIN_TEXT' }],
    isVisibleToIssuerOnly: false,
  };
}
