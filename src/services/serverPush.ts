import youtubeQueue from './queue/youtubeQueue';
import synthesis from './synthesis';
import xService from './xService';

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
}

interface ISayMessage {
  text: string;
}

interface IXMessage {
  soundUrl: string;
}

// let socket;

function handleIncomingMsg(msg: IIcomingMsg) {
  console.log('incoming message'); // tslint:disable-line
  console.log(msg); // tslint:disable-line
  if (msg.action === 'ADD' && msg.song) {
    youtubeQueue.add(msg.song);
  }
}

function handleSay(message: ISayMessage) {
  synthesis.speechApiSay(message.text);
}


function handleX(xsound: IXMessage) {
  xService.play(xsound.soundUrl);
}

function initSocket() {
  // socket = io();
  // socket.on('connect', ()=> console.log('SOCKET CONNECTED!')); // tslint:disable-line
  // socket.on('queue', handleIncomingMsg);
  // socket.on('say', handleSay);
  // socket.on('x', handleX);
  // return socket;
}

export default {
  initSocket,
};
