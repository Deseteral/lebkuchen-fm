class SpeechService {
    constructor(emitter) {
        emitter.on('speech', ({options}) => this.say(...options))
    }

    say(phrase) {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.voice = window.speechSynthesis.getVoices().filter(speech => speech.lang === 'pl-PL')[0];
        utterance.lang = 'pl-PL';
        window.speechSynthesis.speak(utterance);
    }
}

export default SpeechService;
