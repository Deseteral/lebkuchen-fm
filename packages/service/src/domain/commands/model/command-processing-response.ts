export interface CommandProcessingResponseMessage {
  markdown: string,
  isVisibleToIssuerOnly: boolean
}

export interface CommandProcessingResponse {
  message: CommandProcessingResponseMessage,
}

export const CommandProcessingResponses = {
  markdown: (...markdown: string[]): CommandProcessingResponse => ({
    message: { markdown: markdown.join('\n'), isVisibleToIssuerOnly: false },
  }),
  visibleToTheIssuerOnly: (...markdown: string[]): CommandProcessingResponse => ({
    message: { markdown: markdown.join('\n'), isVisibleToIssuerOnly: true },
  }),
};
