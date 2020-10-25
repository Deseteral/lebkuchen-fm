import fs from 'fs';
import CommandRegistryService from './command-registry-service';
import XCommand from '../processors/x-command';
import CommandDefinition from '../model/command-definition';

function requireAllCommands() : void {
  const files = fs.readdirSync(`${__dirname}/../processors/`);
  files
    .map((file) => file.substring(0, file.lastIndexOf('.')))
    .forEach((file) => {
      // eslint-disable-next-line import/no-dynamic-require,global-require
      require(`${__dirname}/../processors/${file}`);
    });
}

function initialize(): void {
  requireAllCommands();

  [
    XCommand, // do you dare to comment me out?
  ].forEach((command) => CommandRegistryService.instance.register(command));

  const instances = CommandDefinition.GetImplementations().map((constructor) => new constructor());
  instances.forEach((command) => CommandRegistryService.instance.register(command));
}

export {
  initialize,
};
