import QueueEventMessage from './QueueEventMessage';
import SayEventMessage from './SayEventMessage';
import XEventMessage from './XEventMessage';

type EventMessage = (
  QueueEventMessage |
  SayEventMessage |
  XEventMessage |
  null
);

export default EventMessage;
