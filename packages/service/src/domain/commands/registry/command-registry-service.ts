import fs from 'fs';
import path from 'path';
import { Service } from 'typedi';
import Logger from '../../../infrastructure/logger';
import CommandProcessor from '../model/command-processor';

type CommandRegistry = Map<string, CommandProcessor>;

@Service()
class CommandRegistryService {
  private static logger = new Logger('command-registry');
  private commands: CommandRegistry;

  constructor() {
    this.commands = new Map();
  }

  register(definition: CommandProcessor): void {
    this.commands.set(definition.key, definition);

    if (definition.shortKey) {
      this.commands.set(definition.shortKey, definition);
    }

    CommandRegistryService.logger.info(`Initialized ${definition.key} command`);
  }

  getRegistry(): Map<string, CommandProcessor> {
    return this.commands;
  }

  static detectProcessorModules(): void {
    const pathToProcessorModules = path.resolve(__dirname, '..', 'processors');
    fs.readdirSync(`${__dirname}/../processors/`)
      .map((fileName) => path.join(pathToProcessorModules, path.parse(fileName).name))
      .forEach((modulePath) => require(modulePath)); // eslint-disable-line global-require, import/no-dynamic-require
  }
}

export default CommandRegistryService;
export {
  CommandRegistry,
};
