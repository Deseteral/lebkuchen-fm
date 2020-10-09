import * as CommandRegistry from './command-registry';
import AddCommand from '../processors/add-command';
import AddXCommand from '../processors/add-x-command';
import HelpCommand from '../processors/help-commands';
import ListXCommand from '../processors/list-x-command';
import QueueCommand from '../processors/queue-command';
import SayCommand from '../processors/say-command';
import XCommand from '../processors/x-command';

function initialize(): void {
  CommandRegistry.register(AddCommand);
  CommandRegistry.register(AddXCommand);
  CommandRegistry.register(HelpCommand);
  CommandRegistry.register(ListXCommand);
  CommandRegistry.register(QueueCommand);
  CommandRegistry.register(SayCommand);
  CommandRegistry.register(XCommand);
}

export {
  initialize,
};
