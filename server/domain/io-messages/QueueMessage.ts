import Song from '../Song';

enum QueueActionType {
  Add = 'ADD',
  Skip = 'SKIP',
}

interface VideoWithId {
  youtubeId: string;
}

interface QueueMessage {
  action: QueueActionType;
  song: (Song | VideoWithId | null);
}

export default QueueMessage;
export {
  QueueActionType,
  VideoWithId,
};
