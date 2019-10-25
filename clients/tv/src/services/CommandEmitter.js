import mitt from 'mitt'
import SpeechService from './SpeechService';

const CommandEmitter = {
    emitter: mitt(),
    init() {
        this.observers = [
            new SpeechService(this.emitter),
        ];
    },
    emit(command, ...options) {
        this.emitter.emit(command, { options });
    }
}
CommandEmitter.init();

export default CommandEmitter;
