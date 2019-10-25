import CommandEmitter from '../services/CommandEmitter';

function executeFmCommand(command, options){
    CommandEmitter.emit(command, options);
}

export default {
    executeFmCommand,
}
