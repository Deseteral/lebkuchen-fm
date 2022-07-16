export interface CommandProcessingResponseMessage {
  markdown: string,
}

export interface CommandProcessingResponse {
  message: CommandProcessingResponseMessage,
}

export class CommandProcessingResponseBuilder {
  markdown: string = '';

  fromMarkdown(markdown: string): CommandProcessingResponseBuilder {
    this.markdown = markdown;
    return this;
  }

  fromMultilineMarkdown(...markdownLines: string[]): CommandProcessingResponseBuilder {
    this.markdown = markdownLines.join('\n');
    return this;
  }

  build(): CommandProcessingResponse {
    return {
      message: { markdown: this.markdown },
    };
  }
}
