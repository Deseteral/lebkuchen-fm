import CommandRegistryService from './command-registry-service';
// import AddCommand from '../processors/add-command';
// import AddXCommand from '../processors/add-x-command';
// import HelpCommand from '../processors/help-command';
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
import CommandDefinition from '../model/command-definition';

function initialize(): void {
  [
    // AddCommand,
    // AddXCommand,
    // HelpCommand,
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
    XCommand,
  ].forEach((command) => CommandRegistryService.instance.register(command));

  const instances = CommandDefinition.GetImplementations().map((constructor) => new constructor());
  console.log(`Wielkość rejestru: ${CommandDefinition.GetImplementations().length}`);
  console.log('Rejestrowanie za pomocą ekhem "adnotacji"');
  instances.forEach((command) => CommandRegistryService.instance.register(command));

  console.log(`Cześć, ja tu tylko wyloguję wszystko co mam w rejestrze: ${instances.map((inst) => inst.key)}`);
}

export {
  initialize,
};
