import CommandEmitter from '../services/CommandEmitter';

function executeFmCommand(command:string, ...options:Array<string>) {
  CommandEmitter.emit(command, ...options);
}

export default {
  executeFmCommand,
};
