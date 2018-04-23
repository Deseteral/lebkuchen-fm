import CommandRegistry from './CommandRegistry';
import EchoCommand from '../EchoCommand';
import SayCommand from '../SayCommand';
import SkipCommand from '../SkipCommand';

function initialize() {
  CommandRegistry.register(EchoCommand);
  CommandRegistry.register(SayCommand);
  CommandRegistry.register(SkipCommand);
}

export default {
  initialize,
};
