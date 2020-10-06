interface MessageBlock {
  text: string,
  type: ('HEADER' | 'PLAIN_TEXT'),
}

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
  makeSingleTextProcessingResponse,
};
