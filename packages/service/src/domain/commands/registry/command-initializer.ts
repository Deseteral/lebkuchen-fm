import * as CommandRegistry from './command-registry';
import HelpCommand from '../processors/help-commands';
import ListXCommand from '../processors/list-x-command';
import QueueCommand from '../processors/queue-command';
import AddXCommand from '../processors/add-x-command';
import XCommand from '../processors/x-command';
import SayCommand from '../processors/say-command';

function initialize(): void {
  CommandRegistry.register(HelpCommand);
  CommandRegistry.register(ListXCommand);
  CommandRegistry.register(QueueCommand);
  CommandRegistry.register(AddXCommand);
  CommandRegistry.register(XCommand);
  CommandRegistry.register(SayCommand);
}

export {
  initialize,
};
