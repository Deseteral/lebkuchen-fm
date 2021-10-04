import CommandRegistryService from './command-registry-service';
import AddCommand from '../processors/add-command';
import AddXCommand from '../processors/add-x-command';
import HelpCommand from '../processors/help-command';
import ListXCommand from '../processors/list-x-command';
import PauseCommand from '../processors/pause-command';
import QueueCommand from '../processors/queue-command';
import RandomCommand from '../processors/random-command';
import ResumeCommand from '../processors/resume-command';
import SayCommand from '../processors/say-command';
import SearchCommand from '../processors/search-command';
import SkipCommand from '../processors/skip-command';
import SpeedCommand from '../processors/speed-command';
import VolumeCommand from '../processors/volume-command';
import XCommand from '../processors/x-command';
import TagAddCommand from '../processors/tag-add-command';

function initialize(): void {
  [
    AddCommand,
    AddXCommand,
    HelpCommand,
    ListXCommand,
    PauseCommand,
    QueueCommand,
    RandomCommand,
    ResumeCommand,
    SayCommand,
    SearchCommand,
    SkipCommand,
    SpeedCommand,
    VolumeCommand,
    TagAddCommand,
    XCommand,
  ].forEach((command) => CommandRegistryService.instance.register(command));
}

export {
  initialize,
};
