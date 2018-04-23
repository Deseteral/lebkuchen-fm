import CommandRegistry from './CommandRegistry';
import EchoCommand from '../EchoCommand';
import SayCommand from '../SayCommand';
import SkipCommand from '../SkipCommand';
import XCommand from '../XCommand';
import SearchCommand from '../SearchCommand';
import QueueCommand from '../QueueCommand';

function initialize() {
  CommandRegistry.register(EchoCommand);
  CommandRegistry.register(SayCommand);
  CommandRegistry.register(SkipCommand);
  CommandRegistry.register(XCommand);
  CommandRegistry.register(SearchCommand);
  CommandRegistry.register(QueueCommand);
}

export default {
  initialize,
};
