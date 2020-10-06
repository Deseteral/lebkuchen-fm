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

  crappyBugHackUtterances.push(msg);
  window.speechSynthesis.speak(msg);
}

export {
  initialize,
  say,
};
