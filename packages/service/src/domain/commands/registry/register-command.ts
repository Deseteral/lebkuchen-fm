import CommandRegistryService from '@service/domain/commands/registry/command-registry-service';
import { Container } from 'typedi';

function RegisterCommand(constructor: Function): void {
  const commandRegistryService = Container.get(CommandRegistryService);
  commandRegistryService.register(Container.get(constructor));
}

export default RegisterCommand;
