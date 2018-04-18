import Song from '../Song';

enum QueueActionType {
  Add = 'ADD',
}

interface QueueMessage {
  action: QueueActionType;
  song: Song;
}

export default QueueMessage;
export {
  QueueActionType,
};
