import * as CommandRegistry from './command-registry';
import EchoCommand from '../processors/echo-command';
import HelpCommand from '../processors/help-commands';
import ListXCommand from '../processors/list-x-command';
import QueueCommand from '../processors/queue-command';

function initialize(): void {
  CommandRegistry.register(EchoCommand);
  CommandRegistry.register(HelpCommand);
  CommandRegistry.register(ListXCommand);
  CommandRegistry.register(QueueCommand);
}

export {
  initialize,
};
