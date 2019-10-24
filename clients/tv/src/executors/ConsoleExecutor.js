import CommandEmmitter from '../services/CommandEmmitter';

function executeFmCommand(command, options){
    CommandEmmitter.emmit(command, options);
}

export default {
    executeFmCommand,
}
