import mitt from 'mitt'

const CommandEmmitter = {
    emmit(command, ...options) {
        const emitter = mitt();
        console.log('emitting');
        emitter.on('speech', (type, e) => console.log(type, e) )
        emitter.emit(command, { options });
    }
}

export default CommandEmmitter;
