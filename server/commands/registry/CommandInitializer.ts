import CommandRegistry from './CommandRegistry';
import EchoCommand from '../EchoCommand';
import SayCommand from '../SayCommand';

function initialize() {
  CommandRegistry.register(EchoCommand);
  CommandRegistry.register(SayCommand);
}

export default {
  initialize,
};
