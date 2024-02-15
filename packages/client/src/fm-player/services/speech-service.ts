function initialize() {
  window.speechSynthesis.getVoices();
}

const crappyBugHackUtterances: SpeechSynthesisUtterance[] = [];
const lang = 'pl-PL';

function say(text: string) {
  const msg = new SpeechSynthesisUtterance(text);

  const [, voice] = window.speechSynthesis.getVoices().filter((v) => v.lang === lang);
  msg.voice = voice;
  msg.lang = lang;
  msg.volume = 1.0;

  crappyBugHackUtterances.push(msg);
  window.speechSynthesis.speak(msg);

  // This is the solution to Chrome speech synthesis bug on long texts
  // https://stackoverflow.com/questions/57667357/speech-synthesis-problem-with-long-texts-pause-mid-speaking
  const intervalId = setInterval(() => {
    if (!speechSynthesis.speaking) {
      clearInterval(intervalId);
    } else {
      speechSynthesis.pause();
      speechSynthesis.resume();
    }
  }, 14000);
}

export {
  initialize,
  say,
};
