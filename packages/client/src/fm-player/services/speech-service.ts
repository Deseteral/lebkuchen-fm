import { tweenOverTime } from '../../services/tween';
import * as PlayerStateService from '../services/player-state-service';

function initialize() {
  window.speechSynthesis.getVoices();
}

const crappyBugHackUtterances: SpeechSynthesisUtterance[] = [];
const lang = 'pl-PL';

function say(text: string) {
  const originalPlayerVolume = PlayerStateService.getState().volume;

  tweenOverTime({
    from: originalPlayerVolume,
    to: 10,
    time: 1000,
    onUpdate: (value) => PlayerStateService.changeVolume(value, false),
    onComplete: () => {
      speechApiSpeak(text, () => { // eslint-disable-line @typescript-eslint/no-use-before-define
        tweenOverTime({
          from: 10,
          to: originalPlayerVolume,
          time: 1000,
          onUpdate: (value) => PlayerStateService.changeVolume(value, false),
        });
      });
    },
  });
}

function speechApiSpeak(text: string, onEndCallback: () => void) {
  const msg = new SpeechSynthesisUtterance(text);

  const [, voice] = window.speechSynthesis.getVoices().filter((v) => v.lang === lang);
  msg.voice = voice;
  msg.lang = lang;
  msg.volume = 1.0;

  // TODO: Remove msg from crappyBugHackUtterances when speech completes.
  msg.onend = onEndCallback;

  crappyBugHackUtterances.push(msg);
  window.speechSynthesis.speak(msg);

  // This is the solution to Chrome speech synthesis bug on long texts
  // https://stackoverflow.com/questions/57667357/speech-synthesis-problem-with-long-texts-pause-mid-speaking
  const intervalId = setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      clearInterval(intervalId);
    } else {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 14000);
}

export {
  initialize,
  say,
};
