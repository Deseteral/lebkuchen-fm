import * as CommandRegistry from './command-registry';
import EchoCommand from '../processors/echo-command';
import HelpCommand from '../processors/help-commands';
import ListXCommand from '../processors/list-x-command';
import QueueCommand from '../processors/queue-command';
import AddXCommand from '../processors/add-x-command';
import XCommand from '../processors/x-command';

function initialize(): void {
  CommandRegistry.register(EchoCommand);
  CommandRegistry.register(HelpCommand);
  CommandRegistry.register(ListXCommand);
  CommandRegistry.register(QueueCommand);
  CommandRegistry.register(AddXCommand);
  CommandRegistry.register(XCommand);
}

export {
  initialize,
};
