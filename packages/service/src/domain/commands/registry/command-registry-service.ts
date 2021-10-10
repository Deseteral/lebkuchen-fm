import path from 'path';
import { Service } from 'typedi';
import glob from 'glob';
import CommandProcessor from '@service/domain/commands/model/command-processor';
import Logger from '@service/infrastructure/logger';

@Service()
class CommandRegistryService {
  private static logger = new Logger('command-registry');
  private commands: Map<string, CommandProcessor>;

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
    glob.sync(path.join(pathToProcessorModules, '**/*-command.js'))
      .forEach((modulePath) => require(modulePath)); // eslint-disable-line global-require, import/no-dynamic-require
  }
}

export default CommandRegistryService;
