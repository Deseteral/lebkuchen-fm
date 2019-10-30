class SpeechService {
    constructor(emitter:mitt.Emitter) {
        emitter.on('speech', ({ options }) => {
            const [phrase] = options;
            this.say(phrase);
        });
    }

    say(phrase:string):void {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.voice = window.speechSynthesis.getVoices().filter(speech => speech.lang === 'pl-PL')[0];
        utterance.lang = 'pl-PL';
        window.speechSynthesis.speak(utterance);
    }
}

export default SpeechService;
