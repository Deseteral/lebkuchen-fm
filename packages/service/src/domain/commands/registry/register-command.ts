import { Container } from 'typedi';
import CommandRegistryService from './command-registry-service';

function RegisterCommand(constructor: Function): void {
  const commandRegistryService = Container.get(CommandRegistryService);
  commandRegistryService.register(Container.get(constructor));
}

export default RegisterCommand;
