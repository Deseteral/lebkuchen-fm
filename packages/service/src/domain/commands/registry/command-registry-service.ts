import fs from 'fs';
import path from 'path';
import { Service } from 'typedi';
import Logger from '../../../infrastructure/logger';
import CommandProcessor from '../model/command-processor';

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
    function requireInsideDirectory(dirPath: string): void {
      fs.readdirSync(dirPath)
        .map((fileName) => path.join(dirPath, fileName))
        .forEach((modulePath) => {
          if (fs.lstatSync(modulePath).isDirectory()) {
            requireInsideDirectory(modulePath);
          } else if (path.extname(modulePath) === '.js') {
            require(modulePath); // eslint-disable-line global-require, import/no-dynamic-require
          }
        });
    }

    const pathToProcessorModules = path.resolve(__dirname, '..', 'processors');
    requireInsideDirectory(pathToProcessorModules);
  }
}

export default CommandRegistryService;
