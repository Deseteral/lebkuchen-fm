import CommandRegistry from './CommandRegistry';
import EchoCommand from '../EchoCommand';
import SayCommand from '../SayCommand';
import SkipCommand from '../SkipCommand';
import XCommand from '../XCommand';
import AddXCommand from '../AddXCommand';
import SearchCommand from '../SearchCommand';
import QueueCommand from '../QueueCommand';
import ListCommand from '../ListCommand';
import AddCommand from '../AddCommand';
import HelpCommand from '../HelpCommand';
import XListCommand from '../XListCommand';

function initialize() {
  CommandRegistry.register(EchoCommand);
  CommandRegistry.register(SayCommand);
  CommandRegistry.register(SkipCommand);
  CommandRegistry.register(XCommand);
  CommandRegistry.register(AddXCommand);
  CommandRegistry.register(SearchCommand);
  CommandRegistry.register(QueueCommand);
  CommandRegistry.register(ListCommand);
  CommandRegistry.register(AddCommand);
  CommandRegistry.register(HelpCommand);
  CommandRegistry.register(XListCommand);
}

export default {
  initialize,
};
