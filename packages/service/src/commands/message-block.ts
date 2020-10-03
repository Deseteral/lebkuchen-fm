interface MessageBlock {
  text: string,
  type: ('HEADER' | 'PLAIN_TEXT'),
}

function makeSingleTextMessage(text: string): MessageBlock[] {
  return [{ text, type: 'PLAIN_TEXT' }];
}

export default MessageBlock;
export {
  makeSingleTextMessage,
};
