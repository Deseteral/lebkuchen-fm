import QueueEventMessage from './QueueEventMessage';
import SayEventMessage from './SayEventMessage';
import XEventMessage from './XEventMessage';
import VolumeEventMessage from "./VolumeEventMessage";

type EventMessage = (
  QueueEventMessage |
  SayEventMessage |
  XEventMessage |
  VolumeEventMessage |
  null
);

export default EventMessage;
