import youtubePlayer from './youtubePlayer';

window.speechSynthesis.getVoices();

function speechApiSay(message, callback?) {
  // @ts-ignore
  window.crappyBugHackUtterances = [];
  const msg = new SpeechSynthesisUtterance();
  // @ts-ignore
  window.crappyBugHackUtterances.push(msg);
  youtubePlayer.changeVolume(10);
  msg.text = message;
  msg.voice = window.speechSynthesis
    .getVoices()
    .filter(v => v.lang === 'pl-PL')[1];
  msg.lang = 'pl-PL';

  msg.onend = () => {
    youtubePlayer.changeVolume(100);
    if (callback) {
      callback();
    }
  };

  window.speechSynthesis.speak(msg);
}

export default {
  speechApiSay,
};
