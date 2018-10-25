import Song from '../Song';

interface QueueEventMessage {
  song: Song;
  playNext?: boolean;
}

export default QueueEventMessage;
