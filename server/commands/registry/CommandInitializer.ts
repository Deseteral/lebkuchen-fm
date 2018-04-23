import CommandRegistry from './CommandRegistry';
import EchoCommand from '../EchoCommand';
import SayCommand from '../SayCommand';
import SkipCommand from '../SkipCommand';
import XCommand from '../XCommand';

function initialize() {
  CommandRegistry.register(EchoCommand);
  CommandRegistry.register(SayCommand);
  CommandRegistry.register(SkipCommand);
  CommandRegistry.register(XCommand);
}

export default {
  initialize,
};
