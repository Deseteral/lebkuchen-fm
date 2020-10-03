import * as CommandRegistry from './command-registry';
import EchoCommand from '../processors/echo-command';
import HelpCommand from '../processors/help-commands';

function initialize(): void {
  CommandRegistry.register(EchoCommand);
  CommandRegistry.register(HelpCommand);
}

export {
  initialize,
};
