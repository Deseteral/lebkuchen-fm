import mitt from 'mitt';

class SpeechService {
    static instance;
    static getInstance() {
        if (!SpeechService.instance) {
            SpeechService.instance = new SpeechService();
        }
        return SpeechService.instance;
    }

    constructor() {
        const emitter = mitt();
        emitter.on('speech', (type, e) => console.log(type, e) )
        //emitter.on('speech', ({options}) => this.say(...options))
    }

    say(phrase) {
        console.log('say');
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.voice = window.speechSynthesis.getVoices().filter(speech => speech.lang === 'pl-PL')[0];
        utterance.lang = 'pl-PL';
        window.speechSynthesis.speak(utterance);
    }
}

export default SpeechService;
