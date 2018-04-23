import CommandRegistry from './CommandRegistry';
import EchoCommand from '../EchoCommand';

function initialize() {
  CommandRegistry.register(EchoCommand);
}

export default {
  initialize,
};
