import youtubeQueue from './queue/youtubeQueue';
import synthesis from './synthesis';
import xService from './xService';
import youtubePlayer from './youtubePlayer';

interface IIcomingMsg {
  action: string;
  song?: ISong;
}
interface ISong {
  _id?: string;
  name: string;
  youtubeId: string;
  trimStartSeconds: (number | null);
  trimEndSeconds: (number | null);
  timesPlayed: number;
  playNext?: boolean;
}

interface ISayMessage {
  text: string;
}

interface IVolumeMessage {
  volume: number;
}

interface IXMessage {
  soundUrl: string;
}

let socket;

function handleIncomingMsg(msg: IIcomingMsg) {
  console.log('incoming message'); // tslint:disable-line
  console.log(msg); // tslint:disable-line
  if (msg.song) {
    youtubeQueue.add(msg.song);
  }
}

function handleSay(message: ISayMessage) {
  synthesis.speechApiSay(message.text);
}

function handleSkip(message: any) {
  youtubePlayer.playNextVideo();
}

function handleResume(message: any) {
  youtubePlayer.resumeYoutubeVideo();
}

function handlePause(message: any) {
  youtubePlayer.pauseYoutubeVideo();
}

function handleX(xsound: IXMessage) {
  xService.play(xsound.soundUrl);
}

function handleVolume(xvolume: IVolumeMessage) {
  youtubePlayer.changeVolume(xvolume.volume);
}

function initSocket() {
  socket = io();
  socket.on('connect', ()=> console.log('SOCKET CONNECTED!')); // tslint:disable-line
  socket.on('queue', handleIncomingMsg);
  socket.on('skip', handleSkip);
  socket.on('resume', handleResume);
  socket.on('pause', handlePause);
  socket.on('say', handleSay);
  socket.on('x', handleX);
  socket.on('volume', handleVolume);
  return socket;
}

export default {
  initSocket,
};
