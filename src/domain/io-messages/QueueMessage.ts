import Song from '../Song';

enum QueueActionType {
  Add = 'ADD',
  Skip = 'SKIP',
}

interface QueueMessage {
  action: QueueActionType;
  song: (Song | null);
}

export default QueueMessage;
export {
  QueueActionType,
};
