import * as CommandRegistry from './command-registry';
import AddCommand from '../processors/add-command';
import AddXCommand from '../processors/add-x-command';
import HelpCommand from '../processors/help-commands';
import ListXCommand from '../processors/list-x-command';
import PauseCommand from '../processors/pause-command';
import QueueCommand from '../processors/queue-command';
import RandomCommand from '../processors/random-command';
import ResumeCommand from '../processors/resume-command';
import SayCommand from '../processors/say-command';
import SearchCommand from '../processors/search-command';
import SkipCommand from '../processors/skip-command';
import VolumeCommand from '../processors/volume-command';
import XCommand from '../processors/x-command';

function initialize(): void {
  CommandRegistry.register(AddCommand);
  CommandRegistry.register(AddXCommand);
  CommandRegistry.register(HelpCommand);
  CommandRegistry.register(ListXCommand);
  CommandRegistry.register(PauseCommand);
  CommandRegistry.register(QueueCommand);
  CommandRegistry.register(RandomCommand);
  CommandRegistry.register(ResumeCommand);
  CommandRegistry.register(SayCommand);
  CommandRegistry.register(SearchCommand);
  CommandRegistry.register(SkipCommand);
  CommandRegistry.register(VolumeCommand);
  CommandRegistry.register(XCommand);
}

export {
  initialize,
};
